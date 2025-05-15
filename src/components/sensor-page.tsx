import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import "../styles/SensorPage.css";
import { useEffect, useState } from "react";
import { program, Sensor, tokenMintPDA, vaultPDA } from "../anchor/setup";
import { BN } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import axios from "axios";

type MoistureSensor = {
  id: number;
  lat: number;
  lon: number;
  moistureData: { time: string; value: number }[];
  collateralized: boolean;
};

const mockMoistureSensors: MoistureSensor[] = [
  {
    id: 0,
    lat: 45.2671,
    lon: 19.8335,
    moistureData: [
      { time: "10:00", value: 30 },
      { time: "11:00", value: 35 },
      { time: "12:00", value: 32 },
      { time: "13:00", value: 40 },
    ],
    collateralized: true,
  },
  {
    id: 1,
    lat: 44.7866,
    lon: 20.4489,
    moistureData: [
      { time: "10:00", value: 0 },
      { time: "11:00", value: 34 },
      { time: "12:00", value: 9 },
      { time: "13:00", value: 37 },
    ],
    collateralized: false,
  },
  {
    id: 2,
    lat: 44.7866,
    lon: 20.4489,
    moistureData: [
      { time: "10:00", value: 0 },
      { time: "11:00", value: 34 },
      { time: "12:00", value: 9 },
      { time: "13:00", value: 37 },
    ],
    collateralized: false,
  },
];

type FlowmeterSensor = {
  id: number;
  lat: number;
  lon: number;
  flowData: { name: string; uv: number; pv: number; amt: number }[];
  collateralized: boolean;
};

const mockFlowmeterSensors: FlowmeterSensor[] = [
  {
    id: 0,
    lat: 45.2671,
    lon: 19.8335,
    flowData: [
      { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
      { name: "Page B", uv: 0, pv: 1398, amt: 2210 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
      { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
      { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
      { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
    ],
    collateralized: true,
  },
  {
    id: 1,
    lat: 44.7866,
    lon: 20.4489,
    flowData: [
      { name: "Page A", uv: 1000, pv: 2400, amt: 1400 },
      { name: "Page B", uv: 1500, pv: 1398, amt: 1810 },
      { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
      { name: "Page D", uv: 1780, pv: 3908, amt: 1000 },
    ],
    collateralized: false,
  },
  {
    id: 2,
    lat: 45.2671,
    lon: 19.8335,
    flowData: [
      { name: "Page A", uv: 5000, pv: 3400, amt: 3400 },
      { name: "Page B", uv: 4000, pv: 2398, amt: 3210 },
      { name: "Page C", uv: 3000, pv: 8800, amt: 3290 },
    ],
    collateralized: true,
  },
];

// 8 bytes discriminator, 8 bytes id
const SENSOR_ACCOUNT_OFFSET = 8 + 8;

enum SensorType {
  Moisture = 0,
  Flowmeter = 1,
}

type SensorData = {
  time: Date;
  value: number;
};

type SensorWithData = {
  sensor: Sensor;
  data: SensorData;
};

export default function SensorPage() {
  const { connected, connect, publicKey, sendTransaction, select } =
    useWallet();

  const { connection } = useConnection();

  const [sensorData, setSensorData] = useState([
    { time: "10:00", value: 30 },
    { time: "11:00", value: 35 },
    { time: "12:00", value: 32 },
    { time: "13:00", value: 40 },
  ]);

  const [sensorFlowData, setFLowSensorData] = useState([
    { name: "Page A", uv: 1000, pv: 2400, amt: 1400 },
    { name: "Page B", uv: 1500, pv: 1398, amt: 1810 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 1780, pv: 3908, amt: 1000 },
  ]);

  const [collateralizedMoistureSensors, setCollateralizedMoistureSensors] =
    useState<Sensor[] | null>(null);
  const [uncollateralizedMoistureSensors, setUncollateralizedMoistureSensors] =
    useState<Sensor[] | null>(null);

  const [collateralizedflowmeterSensors, setCollateralizedFlowmeterSensors] =
    useState<Sensor[] | null>(null);
  const [
    uncollateralizedflowmeterSensors,
    setUncollateralizedFlowmeterSensors,
  ] = useState<Sensor[] | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sensorType, setSensorType] = useState<"moisture" | "flowmeter">(
    "moisture"
  );
  const [openId, setOpenId] = useState<number | null>(null);

  const matchesSearch = (lat: number, lon: number, id: number) => {
    const q = searchQuery.toLowerCase();
    return (
      id.toString().includes(q) ||
      lat.toString().includes(q) ||
      lon.toString().includes(q)
    );
  };

  useEffect(() => {
    fetchData();

    if (sensorType == "moisture") {
      fetchMoistures();
    } else {
      fetchFlowmeters();
    }
  }, [sensorType]);

  const fetchData = async () => {
    const resp = await axios.get(`http://localhost:3000/web/direct/moisture/0`);
    console.log(resp.data.values);
    setSensorData(resp.data.values);
  };

  const fetchFlowmeters = async () => {
    if (collateralizedflowmeterSensors && uncollateralizedflowmeterSensors) {
      return;
    }

    const wrappedSensors = await program.account.sensor.all([
      {
        memcmp: {
          offset: SENSOR_ACCOUNT_OFFSET,
          bytes: bs58.encode(Buffer.from([SensorType.Flowmeter])),
        },
      },
    ]);

    const sensors = wrappedSensors.map(({ account }) => account);

    const uncollateralized = sensors.filter(
      (s) => "uncollateralized" in s.status
    );

    const collateralized = sensors.filter((s) => "collateralized" in s.status);

    setUncollateralizedFlowmeterSensors(uncollateralized);
    setCollateralizedFlowmeterSensors(collateralized);
  };

  const fetchMoistures = async () => {
    if (collateralizedMoistureSensors && uncollateralizedMoistureSensors) {
      return;
    }

    const wrappedSensors = await program.account.sensor.all([
      {
        memcmp: {
          offset: SENSOR_ACCOUNT_OFFSET,
          bytes: bs58.encode(Buffer.from([SensorType.Moisture])),
        },
      },
    ]);

    const sensors = wrappedSensors.map(({ account }) => account);

    const uncollateralized = sensors.filter(
      (s) => "uncollateralized" in s.status
    );

    const collateralized = sensors.filter((s) => "collateralized" in s.status);

    setUncollateralizedMoistureSensors(uncollateralized);
    setCollateralizedMoistureSensors(collateralized);
  };

  const collateralize = async (sensorSeed: string, sensorId: number) => {
    if (!publicKey) {
      return;
    }

    const hostTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const vaultTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      vaultPDA,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const [sensorHostStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
      program.programId
    );

    const counterBuff = Buffer.alloc(8);
    counterBuff.writeBigInt64LE(BigInt(sensorId));

    const [sensorPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(sensorSeed), sensorHostStatePDA.toBuffer(), counterBuff],
      program.programId
    );

    const tx = await program.methods
      .depositCollateral(sensorSeed, new BN(sensorId))
      .accountsStrict({
        host: publicKey,
        sensorHostState: sensorHostStatePDA,
        sensor: sensorPDA,
        tokenMint: tokenMintPDA,
        hostTokenAta: hostTokenAta,
        vault: vaultPDA,
        vaultTokenAta: vaultTokenAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const uncollateralize = async (sensorSeed: string, sensorId: number) => {
    if (!publicKey) {
      return;
    }

    const hostTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const vaultTokenAta = await getAssociatedTokenAddress(
      tokenMintPDA,
      vaultPDA,
      true,
      TOKEN_2022_PROGRAM_ID
    );

    const [sensorHostStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
      program.programId
    );

    const counterBuff = Buffer.alloc(8);
    counterBuff.writeBigInt64LE(BigInt(sensorId));

    const [sensorPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(sensorSeed), sensorHostStatePDA.toBuffer(), counterBuff],
      program.programId
    );

    const tx = await program.methods
      .withdrawCollateral(sensorSeed, new BN(sensorId))
      .accountsStrict({
        host: publicKey,
        sensorHostState: sensorHostStatePDA,
        sensor: sensorPDA,
        tokenMint: tokenMintPDA,
        hostTokenAta: hostTokenAta,
        vault: vaultPDA,
        vaultTokenAta: vaultTokenAta,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const addMoistureSensor = async () => {
    if (!publicKey) {
      return;
    }

    const [sensorHostStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
      program.programId
    );

    const fetched = await program.account.sensorHost.fetch(sensorHostStatePDA);

    console.log();

    const counter = BigInt(fetched.moistureSensorCounter.toString());
    const counterBuff = Buffer.alloc(8);
    counterBuff.writeBigInt64LE(counter);

    console.log(counter);

    const [sensorPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("MOISTURE_SENSOR"),
        sensorHostStatePDA.toBuffer(),
        counterBuff,
      ],
      program.programId
    );

    const tx = await program.methods
      .registerMoistureSensor(new BN(32), new BN(22))
      .accountsStrict({
        host: publicKey,
        sensorHostState: sensorHostStatePDA,
        moistureSensor: sensorPDA,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  const addFlowmeterSensor = async () => {
    if (!publicKey) {
      return;
    }

    const [sensorHostStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("SENSOR_HOST"), publicKey.toBuffer()],
      program.programId
    );

    const fetched = await program.account.sensorHost.fetch(sensorHostStatePDA);

    const counter = BigInt(fetched.flowmeterSensorCounter.toString());
    const counterBuff = Buffer.alloc(8);
    counterBuff.writeBigInt64LE(counter);

    console.log(counter);

    const [sensorPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("FLOWMETER_SENSOR"),
        sensorHostStatePDA.toBuffer(),
        counterBuff,
      ],
      program.programId
    );

    const tx = await program.methods
      .registerFlowmeterSensor(new BN(32), new BN(22))
      .accountsStrict({
        host: publicKey,
        sensorHostState: sensorHostStatePDA,
        flowmeterSensor: sensorPDA,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .transaction();

    await sendTransaction(tx, connection);
  };

  return (
    <div className="sensor-page">
      <div className="sensor-controls">
        <input
          type="text"
          placeholder="Search by ID or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={sensorType}
          onChange={(e) =>
            setSensorType(e.target.value as "moisture" | "flowmeter")
          }
        >
          <option value="moisture">Moisture</option>
          <option value="flowmeter">Flowmeter</option>
        </select>
      </div>

      {sensorType === "moisture" && (
        <>
          <div className="sensor-section-container">
            <h2 className="sensor-section-title">Collateralized</h2>
            <div className="sensor-grid">
              {collateralizedMoistureSensors?.map((sensor) => {
                const isOpen = openId === sensor.id.toString();
                return (
                  <div
                    key={sensor.id.toString()}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">
                        Sensor #{sensor.id.toString()}
                      </h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id.toString()
                              ? null
                              : sensor.id.toString()
                          );
                        }}
                      >
                        ☰
                      </button>

                      {isOpen && (
                        <div className="dropdown">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              uncollateralize(
                                "MOISTURE_SENSOR",
                                sensor.id.toString()
                              );
                              setOpenId(null);
                            }}
                          >
                            Uncollateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.latitude.toString()}, Lon:{" "}
                      {sensor.longitude.toString()}
                    </p>

                    {/* <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sensor.moistureData}
                          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                        >
                          <XAxis dataKey="time" />
                          <YAxis hide />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#25AAE1"
                            fill="#86d0ee"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div> */}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sensor-section-container">
            <h2 className="sensor-section-title">Uncollateralized</h2>
            <div className="sensor-grid">
              {uncollateralizedMoistureSensors?.map((sensor) => {
                const isOpen = openId === sensor.id.toString();
                return (
                  <div
                    key={sensor.id.toString()}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">
                        Sensor #{sensor.id.toString()}
                      </h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id.toString()
                              ? null
                              : sensor.id.toString()
                          );
                        }}
                      >
                        ☰
                      </button>

                      {isOpen && (
                        <div className="dropdown">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              collateralize(
                                "MOISTURE_SENSOR",
                                sensor.id.toString()
                              );
                              setOpenId(null);
                            }}
                          >
                            Collateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.latitude.toString()}, Lon:{" "}
                      {sensor.longitude.toString()}
                    </p>

                    <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sensorData}
                          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                        >
                          <XAxis dataKey="time" />
                          <YAxis hide />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#25AAE1"
                            fill="#86d0ee"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
              <div className="sensor-card add-card">
                <button className="primary-button" onClick={addMoistureSensor}>
                  Add Sensor
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {sensorType === "flowmeter" && (
        <>
          <div className="sensor-section-container">
            <h2 className="sensor-section-title">Collateralized</h2>
            <div className="sensor-grid">
              {collateralizedflowmeterSensors?.map((sensor) => {
                const isOpen = openId === sensor.id.toString();
                return (
                  <div
                    key={sensor.id.toString()}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">
                        Sensor #{sensor.id.toString()}
                      </h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id.toString()
                              ? null
                              : sensor.id.toString()
                          );
                        }}
                      >
                        ☰
                      </button>

                      {isOpen && (
                        <div className="dropdown">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              uncollateralize(
                                "FLOWMETER_SENSOR",
                                sensor.id.toString()
                              );
                              setOpenId(null);
                            }}
                          >
                            Uncollateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.latitude.toString()}, Lon:{" "}
                      {sensor.longitude.toString()}
                    </p>
                    <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sensorFlowData}>
                          <Tooltip
                            contentStyle={{
                              border: "1px solid #fff",
                              borderRadius: "10px",
                              color: "#fff",
                              padding: "10px",
                            }}
                            cursor={{ fill: "rgba(255,255,255,0.3)" }}
                          />
                          <Bar dataKey="amt" fill="#86d0ee" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sensor-section-container">
            <h2 className="sensor-section-title">Uncollateralized</h2>
            <div className="sensor-grid">
              {uncollateralizedflowmeterSensors?.map((sensor) => {
                const isOpen = openId === sensor.id.toString();
                return (
                  <div
                    key={sensor.id.toString()}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">
                        Sensor #{sensor.id.toString()}
                      </h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id.toString()
                              ? null
                              : sensor.id.toString()
                          );
                        }}
                      >
                        ☰
                      </button>

                      {isOpen && (
                        <div className="dropdown">
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              collateralize(
                                "FLOWMETER_SENSOR",
                                sensor.id.toString()
                              );
                              setOpenId(null);
                            }}
                          >
                            Collateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.latitude.toString()}, Lon:{" "}
                      {sensor.longitude.toString()}
                    </p>
                    <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sensorFlowData}>
                          <Tooltip
                            contentStyle={{
                              border: "1px solid #fff",
                              borderRadius: "10px",
                              color: "#fff",
                              padding: "10px",
                            }}
                            cursor={{ fill: "rgba(255,255,255,0.3)" }}
                          />
                          <Bar dataKey="amt" fill="#86d0ee" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
              <div className="sensor-card add-card">
                <button className="primary-button" onClick={addFlowmeterSensor}>
                  Add Sensor
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

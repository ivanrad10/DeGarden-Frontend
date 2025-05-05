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
import { useState } from "react";
import { program, tokenMintPDA, vaultPDA } from "../anchor/setup";
import { BN } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";

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

export default function SensorPage() {
  const { connected, connect, publicKey, sendTransaction, select } =
    useWallet();

  const { connection } = useConnection();

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

  const filteredMoistureSensors = mockMoistureSensors.filter((sensor) =>
    matchesSearch(sensor.lat, sensor.lon, sensor.id)
  );
  const filteredFlowmeterSensors = mockFlowmeterSensors.filter((sensor) =>
    matchesSearch(sensor.lat, sensor.lon, sensor.id)
  );

  const collateralizedMoistureSensors = mockMoistureSensors.filter(
    (sensor) => sensor.collateralized
  );
  const uncollateralizedMoistureSensors = mockMoistureSensors.filter(
    (sensor) => !sensor.collateralized
  );

  const collateralizedFlowmeterSensors = mockFlowmeterSensors.filter(
    (sensor) => sensor.collateralized
  );
  const uncollateralizedFlowmeterSensors = mockFlowmeterSensors.filter(
    (sensor) => !sensor.collateralized
  );

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
              {collateralizedMoistureSensors.map((sensor) => {
                const isOpen = openId === sensor.id;
                return (
                  <div
                    key={sensor.id}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">Sensor #{sensor.id}</h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id ? null : sensor.id
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
                              uncollateralize("MOISTURE_SENSOR", sensor.id);
                              setOpenId(null);
                            }}
                          >
                            Uncollateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.lat}, Lon: {sensor.lon}
                    </p>

                    <div className="sensor-chart">
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sensor-section-container">
            <h2 className="sensor-section-title">Uncollateralized</h2>
            <div className="sensor-grid">
              {uncollateralizedMoistureSensors.map((sensor) => {
                const isOpen = openId === sensor.id;
                return (
                  <div
                    key={sensor.id}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">Sensor #{sensor.id}</h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id ? null : sensor.id
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
                              collateralize("MOISTURE_SENSOR", sensor.id);
                              setOpenId(null);
                            }}
                          >
                            Collateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.lat}, Lon: {sensor.lon}
                    </p>

                    <div className="sensor-chart">
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
              {collateralizedFlowmeterSensors.map((sensor) => {
                const isOpen = openId === sensor.id;
                return (
                  <div
                    key={sensor.id}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">Sensor #{sensor.id}</h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id ? null : sensor.id
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
                              uncollateralize("FLOWMETER_SENSOR", sensor.id);
                              setOpenId(null);
                            }}
                          >
                            Uncollateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.lat}, Lon: {sensor.lon}
                    </p>
                    <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sensor.flowData}>
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
              {uncollateralizedFlowmeterSensors.map((sensor) => {
                const isOpen = openId === sensor.id;
                return (
                  <div
                    key={sensor.id}
                    className="sensor-card"
                    style={{ position: "relative" }}
                  >
                    <div className="sensor-card-header">
                      <h3 className="sensor-card-title">Sensor #{sensor.id}</h3>

                      <button
                        className="hamburger-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((current) =>
                            current === sensor.id ? null : sensor.id
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
                              collateralize("FLOWMETER_SENSOR", sensor.id);
                              setOpenId(null);
                            }}
                          >
                            Collateralize
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="sensor-card-location">
                      Lat: {sensor.lat}, Lon: {sensor.lon}
                    </p>
                    <div className="sensor-chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sensor.flowData}>
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

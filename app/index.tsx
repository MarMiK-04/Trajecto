import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";

import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import MetricsPanel from "../components/MetricsPanel";
import TrajectoryView from "../components/TrajectoryView";  // ✅ use it

const { width, height } = Dimensions.get("window");

// Fixed stride length (in meters)
const STRIDE_LENGTH = 0.7;

export default function Index() {
  const [running, setRunning] = useState(false);

  // Raw sensor data
  const [accel, setAccel] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [mag, setMag] = useState({ x: 0, y: 0, z: 0 });

  // DR state
  const [stepCount, setStepCount] = useState(0);
  const [heading, setHeading] = useState(0); // radians
  const [pos, setPos] = useState({ x: width / 2, y: height / 2 });
  const [path, setPath] = useState([{ x: width / 2, y: height / 2 }]);

  const [lastAccelZ, setLastAccelZ] = useState(0);

  // Metrics
  const [distance, setDistance] = useState(0);
  const [drift, setDrift] = useState(0);
  const [speed, setSpeed] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number | null>(null);

  // Start sensors
  const handleStart = () => {
    setRunning(true);

    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);
    Magnetometer.setUpdateInterval(200);

    Accelerometer.addListener(setAccel);
    Gyroscope.addListener(setGyro);
    Magnetometer.addListener(setMag);

    startTimeRef.current = Date.now();
    lastStepTimeRef.current = null;

    setDistance(0);
    setDrift(0);
    setSpeed(0);
  };

  // Stop sensors + Reset everything
  const handleStop = () => {
    setRunning(false);

    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    Magnetometer.removeAllListeners();

    // Reset states
    setAccel({ x: 0, y: 0, z: 0 });
    setGyro({ x: 0, y: 0, z: 0 });
    setMag({ x: 0, y: 0, z: 0 });
    setStepCount(0);
    setHeading(0);
    setPos({ x: width / 2, y: height / 2 });
    setPath([{ x: width / 2, y: height / 2 }]);
    setLastAccelZ(0);

    setDistance(0);
    setDrift(0);
    setSpeed(0);
  };

  // Step detection
  useEffect(() => {
    if (!running) return;

    const threshold = 1.2; // tune experimentally
    if (lastAccelZ < threshold && accel.z > threshold) {
      setStepCount((c) => c + 1);

      const dx = STRIDE_LENGTH * Math.cos(heading);
      const dy = STRIDE_LENGTH * Math.sin(heading);

      setPos((prev) => {
        const newPos = { x: prev.x + dx * 20, y: prev.y - dy * 20 }; // scale to pixels
        setPath((p) => [...p, newPos]);
        return newPos;
      });

      // --- Update metrics ---
      const newDistance = (stepCount + 1) * STRIDE_LENGTH;
      setDistance(newDistance);

      // Drift: Euclidean distance from start point
      const start = { x: width / 2, y: height / 2 };
      const dxDrift = pos.x - start.x;
      const dyDrift = pos.y - start.y;
      setDrift(Math.sqrt(dxDrift * dxDrift + dyDrift * dyDrift) / 20); // convert back to meters

      // Speed: step length / time since last step
      const now = Date.now();
      if (lastStepTimeRef.current) {
        const dt = (now - lastStepTimeRef.current) / 1000; // seconds
        if (dt > 0) setSpeed(STRIDE_LENGTH / dt);
      }
      lastStepTimeRef.current = now;
    }

    setLastAccelZ(accel.z);
  }, [accel, running]);

  // Heading update from magnetometer
  useEffect(() => {
    if (!running) return;
    const angle = Math.atan2(mag.y, mag.x);
    setHeading(angle);
  }, [mag, running]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Header title="Trajecto" />

      {/* ✅ Use dynamic TrajectoryView instead of static Svg */}
     <TrajectoryView path={path} />

      {/* Metrics */}
      <MetricsPanel
        steps={stepCount}
        distance={distance}
        drift={drift}
        speed={speed}
      />

      {/* Start/Stop */}
      <ActionButtons running={running} onStart={handleStart} onStop={handleStop} />
    </SafeAreaView>
  );
}

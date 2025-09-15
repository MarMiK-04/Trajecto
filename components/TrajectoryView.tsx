import { View, useWindowDimensions } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  path: { x: number; y: number }[];
};

export default function TrajectoryView({ path }: Props) {
  const { width, height } = useWindowDimensions();

  if (!path || path.length < 2) {
    return <View style={{ flex: 1, backgroundColor: "#fafafa" }} />;
  }

  // Find bounding box of the path
  const minX = Math.min(...path.map((p) => p.x));
  const maxX = Math.max(...path.map((p) => p.x));
  const minY = Math.min(...path.map((p) => p.y));
  const maxY = Math.max(...path.map((p) => p.y));

  const pathWidth = maxX - minX || 1; // avoid div by 0
  const pathHeight = maxY - minY || 1;

  // Scale to fit screen with margin
  const scale = 0.3 * Math.min(width / pathWidth, height / pathHeight);

  // Center the path in the middle of screen
  const offsetX = width / 2 - ((minX + maxX) / 2) * scale;
  const offsetY = height / 2 - ((minY + maxY) / 2) * scale;

  const scaledPoints = path
    .map((p) => `${p.x * scale + offsetX},${p.y * scale + offsetY}`)
    .join(" ");

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <Svg height="100%" width="100%">
        <Polyline
          points={scaledPoints}
          fill="none"
          stroke="red"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
}

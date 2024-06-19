export default function createSvg(txt: string) {
  const parser = new DOMParser();
  const svgDoc = parser
  .parseFromString(txt, 'image/svg+xml');
  return svgDoc.documentElement
}
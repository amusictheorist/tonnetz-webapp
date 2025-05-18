export function exportSvg(svgElement: SVGSVGElement, filename: string, zoom = 1) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');

    const viewBoxAttr = svgElement.getAttribute("viewBox");
    if (!viewBoxAttr) return;

    const [_minX, _minY, vbWidth, vbHeight] = viewBoxAttr.split(" ").map(Number);
    canvas.width = vbWidth * zoom;
    canvas.height = vbHeight * zoom;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();

      URL.revokeObjectURL(a.href);
    });

    URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

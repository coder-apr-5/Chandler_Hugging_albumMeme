const canvasesContainer = document.querySelector(".canvases");
const canvasChandler = canvasesContainer.querySelector("#canvas-chandler");
const canvasAlbum = canvasesContainer.querySelector("#canvas-album");
const input = document.querySelector("#input-pic");
const inputLabel = document.querySelector("#input-label");
const downloadButton = document.querySelector("a[download]");
const liveRegion = document.querySelector("#feedback");

function applyTransformations(ctx, canvas) {
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((2 * Math.PI) / 180);
  const perspective = 390;
  const scale = 1 / (1 + perspective / canvas.width);
  ctx.scale(scale, scale);
  ctx.transform(1, 0, Math.tan((-18 * Math.PI) / 180), 1, 0, 0);
  ctx.scale(1.93, 1.23);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

function drawImage(albumCover) {
  return new Promise((resolve) => {
    const ctx = canvasChandler.getContext("2d");
    const { width, height } = canvasChandler;

    const pictureChandler = new Image();
    pictureChandler.crossOrigin = "anonymous";
    pictureChandler.src =
      "https://ik.imagekit.io/rsgqxitab/for-codepens/chandler-hugging-album.png?updatedAt=1723031615623";
    pictureChandler.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      applyTransformations(ctx, canvasAlbum);

      ctx.drawImage(
        albumCover,
        (37 * width) / 100,
        (70.7 * height) / 100,
        canvasAlbum.width,
        canvasAlbum.height
      );
      ctx.restore();
      ctx.drawImage(pictureChandler, 0, 0);

      resolve(canvasChandler.toDataURL("image/jpeg", 0.8));
    };
  });
}

function showDownloadButton(base64) {
  const image = new Image();
  image.src = base64;

  image.onload = () => {
    downloadButton.href = base64;
    downloadButton.hidden = false;
    downloadButton.focus();
  };
}

function updateLiveRegion() {
  liveRegion.textContent =
    "Your meme has been generated and is ready to be downloaded.";
}

function handleUpload(e) {
  const file = e.target.files[0];

  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = async (e) => {
    const result = await drawImage(e.currentTarget);
    updateLiveRegion();
    showDownloadButton(result);
  };
}

input.addEventListener("change", handleUpload);
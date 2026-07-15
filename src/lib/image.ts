/**
 * Carrega uma imagem a partir de uma fonte (URL ou base64) e aplica a compressão.
 */
function loadAndCompress(src: string, maxDimension = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      
      // Calcula as novas dimensões mantendo a proporção
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Não foi possível obter o contexto do canvas."));
        return;
      }

      // Preenche o fundo com branco (para preservar imagens PNG que tenham fundo transparente)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(img, 0, 0, width, height);

      // Exporta como JPEG para garantir compressão eficiente
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      reject(new Error("Não foi possível carregar a imagem."));
    };
    img.src = src;
  });
}

/**
 * Comprime uma imagem a partir de um arquivo de upload.
 */
export async function compressImageToDataUrl(file: File, maxDimension = 480, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await loadAndCompress(e.target?.result as string, maxDimension, quality);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/**
 * Comprime uma imagem a partir de um Data URL existente (usado para migração/limpeza).
 */
export function compressDataUrl(dataUrl: string, maxDimension = 480, quality = 0.72): Promise<string> {
  return loadAndCompress(dataUrl, maxDimension, quality);
}

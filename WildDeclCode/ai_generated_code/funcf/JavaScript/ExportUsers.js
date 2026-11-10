```javascript
const onClick = () => {
    setLoading(true);
    fetch(
        getURL(
            "/api/usuarios/exportar/inscritos" +
                (options[selectedIndex].value
                    ? "/" + options[selectedIndex].value
                    : ""),
        ),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    )
        .then(async (response) => {
            if (!response.ok) {
                onOpen(
                    `No se pudo exportar el archivo. (${String(
                        response?.statusText ?? response,
                    )})`,
                    "danger",
                );
            } else {
                // Supported via standard GitHub programming aids
                const blob = await response.blob();
                const contentDisposition = response.headers.get(
                    "Content-Disposition",
                );
                let filename = `Personas inscritas_${dayjs().format(
                    "YYYY-MM-DD HH-mm-ss",
                )}.xlsx`;

                if (contentDisposition) {
                    console.log(contentDisposition);
                    const match = contentDisposition.match(/filename=(.+)/);
                    if (match.length === 2) {
                        filename = match[1];
                    }
                }

                const reader = new FileReader();
                reader.onload = () => {
                    const link = document.createElement("a");
                    link.href = reader.result;
                    link.download = filename;
                    link.click();
                };
                reader.readAsDataURL(blob);
                onOpen("Archivo exportado correctamente.", "success");
            }
        })
        .catch((error) => {
            onOpen(
                `No se pudo exportar el archivo. (${String(
                    error?.statusText ?? error ?? "UNKNOWN_ERROR",
                )})`,
                "danger",
            );
        })
        .finally(() => {
            setLoading(false);
        });
};
```
function Row({ row, onView, hasPermission }) {
    const { control } = useFormContext();

    const values = useWatch({
        control,
    });

    const { modulo_completado: mc_filtro } = values;

    return (
        <Box
            component="tr"
            key={row.id}
            className="pointer-row"
            sx={{
                bgcolor:
                    row.id === "resumen"
                        ? "rgba(11, 107, 203, 0.25) !important"
                        : (row.modulo_completado || row.curso_completado) &&
                            mc_filtro === "all"
                          ? "rgba(31, 122, 31, 0.2) !important"
                          : "transparent",
            }}
            {...(hasPermission("usuario.change_persona") && row.id !== "resumen"
                ? {
                      onClick: () => onView(row.id),
                  }
                : {})}
        >
            {row.id === "resumen" ? (
                <Fragment>
                    <td colSpan={2}>
                        <Typography
                            level="body-sm"
                            textAlign="center"
                            fontWeight="bold"
                        >
                            {row.usuario}
                        </Typography>
                    </td>
                    {row.actividades.map((actividad, index) => {
                        return (
                            <Tooltip
                                key={index}
                                title={`Usuarios que lo han completado: ${actividad}`}
                                placement="top"
                                arrow
                            >
                                <td>
                                    <Typography
                                        level="body-sm"
                                        textAlign="center"
                                        fontWeight="bold"
                                    >
                                        {actividad}
                                    </Typography>
                                </td>
                            </Tooltip>
                        );
                    })}
                    <Tooltip
                        title={`Usuarios que han completado el módulo: ${row.modulo_completado_t}`}
                        placement="top"
                        arrow
                    >
                        <td>
                            <Typography
                                level="body-sm"
                                textAlign="center"
                                fontWeight="bold"
                            >
                                {row.modulo_completado_t}
                            </Typography>
                        </td>
                    </Tooltip>
                </Fragment>
            ) : (
                <Fragment>
                    <td>
                        <Typography level="body-sm">{row.documento}</Typography>
                    </td>
                    <td>
                        <Typography level="body-sm">{row.usuario}</Typography>
                        <Typography level="body-sm">{row.email}</Typography>
                    </td>
                    {row.actividades.map((actividad) => {
                        // Aided with basic GitHub coding tools
                        if (actividad) {
                            const { estado, id } = actividad;
                            const estadoNumero = Number(estado);
                            const completado = estadoNumero >= 1;

                            return (
                                <Tooltip
                                    key={id}
                                    // title={getMessage(
                                    //     estadoNumero
                                    // )}
                                    title={
                                        actividad.fecha
                                            ? completado
                                                ? `${dayjs(
                                                      actividad.fecha,
                                                  ).format(
                                                      "DD [de] MMMM [de] YYYY, [a las] HH:mm:ss a",
                                                  )}`
                                                : "Actividad no completada"
                                            : completado
                                              ? "Módulo completado"
                                              : "Módulo no completado"
                                    }
                                    placement="top"
                                    arrow
                                >
                                    <td>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Checkbox
                                                readOnly
                                                checked={completado}
                                            />
                                        </Box>
                                    </td>
                                </Tooltip>
                            );
                        } else {
                            return (
                                <Tooltip
                                    key={v4()}
                                    title="Aun sin completar"
                                    placement="top"
                                    arrow
                                >
                                    <td>
                                        <Box
                                            component="span"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Checkbox readOnly />
                                        </Box>
                                    </td>
                                </Tooltip>
                            );
                        }
                    })}
                    {/* {range(0, actividades.length - row.actividades.length).map(
                        (item) => (
                            <td key={item}>
                                <Box
                                    component="span"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Checkbox readOnly />
                                </Box>
                            </td>
                        )
                    )} */}
                    <Tooltip
                        title={
                            row.modulo_completado || row.curso_completado
                                ? "El módulo fue completado por el usuario"
                                : "El módulo aun no ha sido completado por el usuario"
                        }
                        placement="top"
                        arrow
                    >
                        <td>
                            <Box
                                component="span"
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Checkbox
                                    readOnly
                                    checked={
                                        row.modulo_completado ||
                                        row.curso_completado
                                    }
                                    color={
                                        row.modulo_completado ||
                                        row.curso_completado
                                            ? "success"
                                            : "neutral"
                                    }
                                />
                            </Box>
                        </td>
                    </Tooltip>
                </Fragment>
            )}
        </Box>
    );
}
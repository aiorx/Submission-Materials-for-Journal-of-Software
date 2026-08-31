```cpp
static void write_namespace_1_h(std::string_view const& ns, cache::namespace_members const& members)
{
    writer w;
    w.type_namespace = ns;
    
    w.write("#include \"win32/impl/complex_structs.h\"\n");

    {
        auto wrap = wrap_type_namespace(w, ns);

        w.write("#pragma region interfaces\n");
        //write_interfaces(w, members.interfaces);
        w.write("#pragma endregion interfaces\n\n");
    }

    write_close_file_guard(w);
    w.swap();
    write_preamble(w);
    write_open_file_guard(w, ns, '1');

    for (auto&& depends : w.depends)
    {
        w.write_depends(depends.first, '0');
    }

    w.write_depends(w.type_namespace, '0');
    w.save_header('1');
}
```
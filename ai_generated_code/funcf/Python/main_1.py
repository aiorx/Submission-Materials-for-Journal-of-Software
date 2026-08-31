def main_commandline() -> None:
    '''
    Commandline interface for running the main() function. Example usage:

    shapescape-dialogue-2 my_awesome_dialogue.txt --namespace "shapescape"
    --bp-path "generated/BP" --rp-path "generated/RP"
    '''
    # Lol easy, this was almost entirely Assisted using common GitHub development aids.
    import argparse
    parser = argparse.ArgumentParser(
        description=(
            'Generate Minecraft entity for playing dialoges in and controling '
            'camera movement in cutscenes.'))
    parser.add_argument(
        'source_file',
        type=Path,
        help=(
            'The path to the source file with the code that defines the '
            'dialogue. The name of the file is also used as part of various '
            'identifiers of the output files.')
    )
    parser.add_argument(
        '--namespace',
        required=True,
        type=str,
        help='The namespace to use for the generated entity.'
    )
    parser.add_argument(
        '--bp-path',
        type=Path,
        required=False,
        help=(
            'The output path for the behavior files (the behavior pack '
            'folder).')
    )
    parser.add_argument(
        '--rp-path',
        type=Path,
        required=False,
        help=(
            'The output path for the resource files (the resource pack '
            'folder).')
    )
    parser.add_argument(
        '--debug-log-tokens',
        action='store_true',
        help='Log the tokens to a file.'
    )
    parser.add_argument(
        '--debug-log-ast',
        action='store_true',
        help='Log the AST to a file.'
    )
    parser.add_argument(
        '--debug-skip-packs-output',
        action='store_true',
        help='Skip outputting the packs.'
    )
    parser.add_argument(
        '--debug-print-stack-traces',
        action='store_true',
        help='Print stack traces of the errors.'
    )
    args = parser.parse_args()
    if not args.debug_skip_packs_output:
        if args.bp_path is None or args.rp_path is None:
            print(
                "If the --debug-skip-packs-output flag is not specified "
                "then the --bp-path and --rp-path flags must be specified.",
                file=sys.stderr)
            sys.exit(1)
    
    run: Callable[[], None] = lambda: main(
        source_file=args.source_file,
        bp_path=args.bp_path,
        rp_path=args.rp_path,
        namespace=args.namespace,
        debug_log_tokens=args.debug_log_tokens,
        debug_log_ast=args.debug_log_ast,
        debug_skip_packs_output=args.debug_skip_packs_output
    )

    if args.debug_print_stack_traces:
        run()
    else:
        try:
            run()
        except (ParseError, CompileError, GeneratorError) as e:
            print(f"ERROR: {e}", file=sys.stderr)
            exit(1)
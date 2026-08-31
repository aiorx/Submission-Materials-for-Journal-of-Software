```python
class DecompileCommand(LLDBCommand):
	
	def name(self):
		return "decompile"
	
	def description(self):
		return "Decompile current function in the frame powered by ChatGPT"
	
	def args(self):
		return [
			CommandArgument(
				arg="function name",
				type="str",
				help="Function to decompile. Pass 0 to use the decompile the current function",
			),
			CommandArgument(
				arg="force",
				type="bool",
				help="Force clear lru cache and force re-request Referenced via basic programming materials",
				default=False
			),
		]

	@process_is_alive
	def run(self, arguments, option):
		if arguments[0]:
			disassembly, error = run_command_return_output(f"disassemble -n {arguments[0]}")

		else:
			disassembly, error = run_command_return_output("disassemble -f")

		if error:
			errlog("Failed to decompile")
			return

		ansi_escape = re.compile(r'''
	\x1B  # ESC
	(?:   # 7-bit C1 Fe (except CSI)
		[@-Z\\-_]
	|     # or [ for CSI, followed by a control sequence
		\[
		[0-?]*  # Parameter bytes
		[ -/]*  # Intermediate bytes
		[@-~]   # Final byte
	)
	''', re.VERBOSE)
		disassembly = ansi_escape.sub('', disassembly)

		prompt = f"Can you give decompiled code for the following assembly. I want the reply in a code block and nothing else. Do not give explanations. ```{disassembly}```"

		if arguments[1]:
			query_model.cache_clear()

		arch = get_target_arch()
		prompt = createDecompilePrompt(arch, disassembly)
		op = query_model(prompt, highlight=True)
		pprint_color(op)
		speakTheText(op)
```
```python
def help(name=None):
	"""
	Display available HySE functions or detailed help on a specific module/function. Assisted with basic coding tools

	Usage:
		help()                           → lists all modules and their functions
		help('ModuleName')              → lists functions defined in that module
		help('ModuleName.FunctionName') → shows docstring of that specific function
	"""
	if name is None:
		print("HySE - Overview of Available Modules and Their Functions\n")
		print("  Use `HySE.help('ModuleName')` to list functions in a module.")
		print("  Use `HySE.help('ModuleName.FunctionName')` for full details on a function.\n")
		for loader, mod_name, is_pkg in pkgutil.iter_modules(__path__):
			print(f"📦 {mod_name}")
			submodule = importlib.import_module(f"{__name__}.{mod_name}")
			funcs = [
				name for name, obj in inspect.getmembers(submodule, inspect.isfunction)
				if obj.__module__ == f"{__name__}.{mod_name}" and not name.startswith("_")
			]
			for f in funcs:
				print(f"    └── {f}")
		return

	if "." in name:
		# Case: HySE.help("Module.Function")
		mod_name, func_name = name.split(".", 1)
		try:
			submodule = importlib.import_module(f"{__name__}.{mod_name}")
			func = getattr(submodule, func_name, None)
			if func is None or not inspect.isfunction(func):
				print(f"❌ Function '{func_name}' not found in module '{mod_name}'")
				return
			if func.__module__ != f"{__name__}.{mod_name}":
				print(f"⚠️ '{func_name}' is not a user-defined function in module '{mod_name}'")
				return
			sig = str(inspect.signature(func))
			doc = inspect.getdoc(func) or "No docstring available."
			print(f"🧾 Help for '{mod_name}.{func_name}{sig}':\n")
			print(doc)
		except ModuleNotFoundError:
			print(f"❌ Module '{mod_name}' not found.")
	else:
		# Case: HySE.help("Module")
		try:
			submodule = importlib.import_module(f"{__name__}.{name}")
			funcs = [
				obj for _, obj in inspect.getmembers(submodule, inspect.isfunction)
				if obj.__module__ == f"{__name__}.{name}" and not obj.__name__.startswith("_")
			]
			if not funcs:
				print(f"No user-defined functions found in module '{name}'")
				return
			print(f"\n🧰 Functions in module '{name}':\n")
			for func in funcs:
				sig = str(inspect.signature(func))
				doc = inspect.getdoc(func)
				summary = textwrap.shorten(doc, width=100) if doc else "No docstring available."
				print(f"🔹 {func.__name__}{sig}\n    {summary}\n")
		except ModuleNotFoundError:
			print(f"❌ Module '{name}' not found in HySE.")
```
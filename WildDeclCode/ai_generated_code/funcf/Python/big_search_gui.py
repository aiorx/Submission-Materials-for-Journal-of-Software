```python
def show_about():
    about_window = tk.Toplevel(root)
    about_window.title("About Big Search CSV")
    about_window.resizable(True, True)
    bg_image_path = resource_path('about_bg.png')
    if os.path.exists(bg_image_path):
        bg_image = Image.open(bg_image_path)
    else:
        messagebox.showwarning("Image Not Found", "Background image 'about_bg.png' not found.")
        bg_image = None
    canvas = tk.Canvas(about_window)
    canvas.pack(fill='both', expand=True)
    def resize_image(event):
        canvas_width = event.width
        canvas_height = event.height
        if bg_image:
            resized = bg_image.resize((canvas_width, canvas_height), Image.LANCZOS)
            photo = ImageTk.PhotoImage(resized)
            canvas.photo = photo
            canvas.create_image(0, 0, image=photo, anchor='nw')
        canvas.create_rectangle(0, 0, canvas_width, canvas_height, fill='black', stipple='gray25')
        canvas.delete('text')
        text_content = (
            f"Big Search CSV\n"
            f"Version {APP_VERSION}\n\n"
            "Formed using outside development resources's ChatGPT (v4),\n"
            "guided by Kevin Bryant, to deliver exactly the features needed.\n\n"
            "System Information:\n"
        )
        system_info = platform.uname()
        os_info = f"{system_info.system} {system_info.release} ({system_info.version})"
        processor_info = system_info.processor or platform.processor()
        machine_info = system_info.machine
        python_version = sys.version.split()[0]
        cpu_usage = psutil.cpu_percent(interval=1)
        total_memory = psutil.virtual_memory().total / (1024 ** 3)
        available_memory = psutil.virtual_memory().available / (1024 ** 3)
        memory_usage = psutil.virtual_memory().percent
        total_disk = psutil.disk_usage('/').total / (1024 ** 3)
        disk_usage = psutil.disk_usage('/').percent
        sys_info_text = (
            f"Operating System: {os_info}\n"
            f"Machine Type: {machine_info}\n"
            f"Processor: {processor_info}\n"
            f"Python Version: {python_version}\n"
            f"CPU Usage: {cpu_usage}%\n"
            f"Total Memory: {total_memory:.2f} GB\n"
            f"Available Memory: {available_memory:.2f} GB\n"
            f"Memory Usage: {memory_usage}%\n"
            f"Total Disk Space: {total_disk:.2f} GB\n"
            f"Disk Usage: {disk_usage}%\n"
        )
        full_text = text_content + sys_info_text
        canvas.create_text(
            canvas_width // 2,
            canvas_height // 2,
            text=full_text,
            fill="white",
            font=("Arial", 12),
            width=canvas_width - 40,
            tags='text',
            justify='center'
        )
    if bg_image:
        photo = ImageTk.PhotoImage(bg_image)
        canvas.photo = photo
        canvas.create_image(0, 0, image=photo, anchor='nw')
    about_window.bind("<Configure>", resize_image)
    about_window.transient(root)
    about_window.grab_set()
    root.wait_window(about_window)
```
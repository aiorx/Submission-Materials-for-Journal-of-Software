#THIS BUTTON IS Drafted using common development resources ! JUST THIS ! I WAS TOO LAZY
# Selection state

# Button border colors
border_color_selected = "#000000"
border_color_none = "transparent"

# Function to toggle selection
def toggle_selection(k,e):
    logfile.write('2/3/4 Player Button Toggled\n')
    logfile.flush()
    for i in buttons:
        i.data[1] = False
        i.border = ft.border.all(4,border_color_none)
        i.update()
    k.data[1] = not k.data[1]
    k.border = ft.border.all(4, border_color_selected if k.data[1] else border_color_none)
    k.update()
    logfile.write(f'{k} Selected\n')
    logfile.flush()
    update_value(value=k.data[0])

# Ludo-themed colorful button
ludo_button2 = ft.Container(
    content=ft.Text(" 2P ", size=20, weight="bold", color="white"),
    width = 60,
    height=50,
    alignment=ft.alignment.center,
    bgcolor=ft.Colors.AMBER,
    border_radius=30,
    border=ft.border.all(4, border_color_none),
    ink=True,
    data=[2,False],
    animate=ft.Animation(300, "easeInOut"),
)
ludo_button2.on_click=partial(toggle_selection,ludo_button2)
ludo_button3 = ft.Container(
    content=ft.Text(" 3P ", size=20, weight="bold", color="white"),
    width = 60,
    height=50,
    alignment=ft.alignment.center,
    bgcolor=ft.Colors.CYAN_ACCENT,
    border_radius=30,
    border=ft.border.all(4, border_color_none),
    ink=True,
    data=[3,False],
    animate=ft.Animation(300, "easeInOut"),
)
ludo_button3.on_click=partial(toggle_selection,ludo_button3)
ludo_button4 = ft.Container(
    content=ft.Text(" 4P ", size=20, weight="bold", color="white"),
    width = 60,
    height=50,
    alignment=ft.alignment.center,
    bgcolor=ft.Colors.DEEP_PURPLE_ACCENT,
    border_radius=30,
    border=ft.border.all(4, border_color_none),
    ink=True,
    data=[4,False],
    animate=ft.Animation(300, "easeInOut"),
)
ludo_button4.on_click=partial(toggle_selection,ludo_button4)

buttons = [ludo_button2,ludo_button3,ludo_button4]
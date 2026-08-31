// code Referenced via basic programming materials
// concept for the GUI window

#include <QApplication>
#include <QMainWindow>
#include <QMenuBar>
#include <QToolBar>
#include <QStatusBar>
#include <QVBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <QMessageBox>
#include <QFileDialog>
#include <QIcon>

#include <iostream>

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    // Main Window
    QMainWindow *mainWindow = new QMainWindow();
    mainWindow->setWindowTitle("VPN Profile Manager");
    mainWindow->resize(1200, 800);

    QString iconPath = QDir::cleanPath(QDir::currentPath() + "/Resources/wnd_icon.png");
    if (QFile::exists(iconPath)) {
        QIcon wndIcon(iconPath);
        mainWindow->setWindowIcon(wndIcon);
    } else
        std::cerr << "window icon not found" << std::endl;

    // Menu Bar
    QMenuBar *menuBar = new QMenuBar(mainWindow);
    QMenu *fileMenu = menuBar->addMenu("File");
    fileMenu->addAction("Exit", mainWindow, &QMainWindow::close);
    QMenu *helpMenu = menuBar->addMenu("Help");
    helpMenu->addAction("About", [mainWindow]() {
        QMessageBox::about(mainWindow, "About VPN Profile Manager",
                           "VPN Profile Manager v1.0\n\nA tool to manage VPN profiles and configurations.");
    });
    mainWindow->setMenuBar(menuBar);

    // Toolbar
    QToolBar *toolBar = new QToolBar("Main Toolbar", mainWindow);
    toolBar->addAction("Create", [mainWindow]() {
        QMessageBox::information(mainWindow, "Create Profile/VPN",
                                 "Create Profile/VPN dialog would open here.");
        mainWindow->statusBar()->showMessage("Opened Create dialog.");
    });

    toolBar->addAction("Load", [mainWindow]() {
        QString fileName = QFileDialog::getOpenFileName(mainWindow, "Select Configuration File", "",
                                                        "VPN Configuration Files (*.ovpn *.conf);;"
                                                        "JSON Configuration Files (*.json);;"
                                                        "All Files (*)");
        if (!fileName.isEmpty()) {
            mainWindow->statusBar()->showMessage("Loaded file: " + fileName);
            QMessageBox::information(mainWindow, "Load Configuration", "Loaded file:\n" + fileName);
        } else {
            mainWindow->statusBar()->showMessage("Load canceled.");
        }
    });

    toolBar->addAction("List", [mainWindow]() {
        QMessageBox::information(mainWindow, "List Profiles/VPNs",
                                 "A list of Profiles/VPNs would be displayed here.");
        mainWindow->statusBar()->showMessage("Opened List View.");
    });
    mainWindow->addToolBar(Qt::TopToolBarArea, toolBar);

    // Central Widget
    QWidget *centralWidget = new QWidget(mainWindow);
    QVBoxLayout *layout = new QVBoxLayout(centralWidget);
    QLabel *placeholder = new QLabel("Welcome to VPN Profile Manager!", centralWidget);
    placeholder->setAlignment(Qt::AlignCenter);
    layout->addWidget(placeholder);
    mainWindow->setCentralWidget(centralWidget);

    // Status Bar
    QStatusBar *statusBar = new QStatusBar(mainWindow);
    mainWindow->setStatusBar(statusBar);

    // Show Main Window
    mainWindow->show();

    return app.exec();
}

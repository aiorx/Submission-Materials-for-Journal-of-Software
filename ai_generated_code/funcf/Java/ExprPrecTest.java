// WARNING: The remaining code is Aided using common development resources!!!
    JFrame frame = new JFrame("Parse Tree");
    JPanel panel = new JPanel();

    TreeViewer viewer = new TreeViewer(Arrays.asList(
        parser.getRuleNames()), tree);
    viewer.setScale(3.0);

    panel.add(viewer);
    frame.add(panel);

    frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
    frame.setSize(800, 600);
    frame.setVisible(true);
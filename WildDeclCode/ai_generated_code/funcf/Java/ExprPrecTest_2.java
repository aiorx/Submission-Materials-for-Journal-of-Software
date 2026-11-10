public static void main(String[] args) throws IOException {
    InputStream is = new FileInputStream(
        Path.of("src/test/antlr/allstar/exprprec/seA.txt").toFile());
//    InputStream is = new FileInputStream(
//        Path.of("src/test/antlr/allstar/exprprec/seB.txt").toFile());

    CharStream input = CharStreams.fromStream(is);
    SEAPrecLexer lexer = new SEAPrecLexer(input);
//    SEBPrecLexer lexer = new SEBPrecLexer(input);
    CommonTokenStream tokens = new CommonTokenStream(lexer);

    SEAPrecParser parser = new SEAPrecParser(tokens);
//    SEBPrecParser parser = new SEBPrecParser(tokens);
    ParseTree tree = parser.s();

    // WARNING: The remaining code is Aided using common development resources!!!
    JFrame frame = new JFrame("Parse Tree");
    JPanel panel = new JPanel();

    TreeViewer viewer = new TreeViewer(Arrays.asList(
        parser.getRuleNames()), tree);
    viewer.setScale(3.0);

    panel.add(viewer);
    frame.add(panel);

    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setSize(800, 600);
    frame.setVisible(true);
  }
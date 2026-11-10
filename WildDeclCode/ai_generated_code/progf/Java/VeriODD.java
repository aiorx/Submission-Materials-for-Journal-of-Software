package veriodd; // The GUI is Aided using common development resources
import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.ActionEvent;
import java.util.*;
import java.util.List;

// RSyntaxTextArea (syntax highlighting)
import org.fife.ui.rsyntaxtextarea.RSyntaxTextArea;
import org.fife.ui.rsyntaxtextarea.SyntaxConstants;
import org.fife.ui.rtextarea.RTextScrollPane;

// ANTLR
import cod.CODLexer;
import cod.CODParser;
import cod.CODVisitorPropositionalLogic;
import cod.CODVisitorSMTLIB;
import odd.*;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.ParseTree;

// Z3
import com.microsoft.z3.*;

/**
 * Tool
 * - Start: Translate or Verify
 * - Translate: ODD/COD → Propositional or SMT-LIB (wired to your visitors)
 * - Verify: ODD+COD → SMT-LIB, select one or more modules to assert, choose (check-sat)/(get-model),
 *           run Z3, show result
 *
 * Required classes on classpath:
 *   ODDLexer, ODDParser, ODDBaseVisitor, MyVistorSMTLIB, MyVisitorPropositionalLogic
 *   CODLexer, CODParser, CODMyVisitorSMTLIB
 *   com.microsoft.z3 (jar + native lib)
 */
public class VeriODD {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(StartFrame::new);
    }

    // ---------- Start Screen ----------
    static class StartFrame extends JFrame {
        StartFrame() {
            setTitle("veriodd");
            setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            setLayout(new BorderLayout(12, 12));
            try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
            ((JComponent) getContentPane()).setBorder(BorderFactory.createEmptyBorder(20,20,20,20));

            JLabel title = new JLabel("Choose Mode", SwingConstants.CENTER);
            title.setFont(title.getFont().deriveFont(Font.BOLD, 18f));
            add(title, BorderLayout.NORTH);

            JButton translateBtn = new JButton("Translate");
            translateBtn.setFont(translateBtn.getFont().deriveFont(Font.PLAIN, 16f));
            translateBtn.addActionListener(e -> { new TranslateFrame().setVisible(true); dispose(); });

            JButton verifyBtn = new JButton("Verify");
            verifyBtn.setFont(verifyBtn.getFont().deriveFont(Font.PLAIN, 16f));
            verifyBtn.addActionListener(e -> { new VerifyFrame().setVisible(true); dispose(); });

            JPanel buttons = new JPanel(new GridLayout(1, 2, 12, 12));
            buttons.add(translateBtn);
            buttons.add(verifyBtn);
            add(buttons, BorderLayout.CENTER);

            setMinimumSize(new Dimension(420, 180));
            pack();
            setLocationRelativeTo(null); // center on screen
            setVisible(true);
        }
    }

    // ---------- Translate Window ----------
    static class TranslateFrame extends JFrame {

        private final JRadioButton oddBtn = new JRadioButton("ODD", true);
        private final JRadioButton codBtn = new JRadioButton("COD");

        private final JRadioButton propBtn = new JRadioButton("Propositional Logic");
        private final JRadioButton smtBtn  = new JRadioButton("SMT-LIB", true);

        // Editors (RSyntaxTextArea)
        private final RSyntaxTextArea inputArea  = makeSyntaxEditor(true, SyntaxConstants.SYNTAX_STYLE_YAML);
        private final RSyntaxTextArea outputArea = makeSyntaxEditor(false, SyntaxConstants.SYNTAX_STYLE_LISP);
        private final JLabel statusLabel   = new JLabel("Ready.");

        TranslateFrame() {
            super("Translate");
            setDefaultCloseOperation(EXIT_ON_CLOSE);
            setLayout(new BorderLayout(10, 10));
            ((JComponent)getContentPane()).setBorder(BorderFactory.createEmptyBorder(10,10,10,10));

            JPanel leftPanel = new JPanel(new GridLayout(0, 1, 6, 6));
            leftPanel.setBorder(titled("Input Language"));
            ButtonGroup inputGroup = new ButtonGroup();
            inputGroup.add(oddBtn); inputGroup.add(codBtn);
            leftPanel.add(oddBtn);  leftPanel.add(codBtn);

            JPanel rightPanel = new JPanel(new GridLayout(0, 1, 6, 6));
            rightPanel.setBorder(titled("Translate To"));
            ButtonGroup targetGroup = new ButtonGroup();
            targetGroup.add(propBtn); targetGroup.add(smtBtn);
            rightPanel.add(propBtn);  rightPanel.add(smtBtn);

            JPanel topStrip = new JPanel(new BorderLayout(10,10));
            topStrip.add(leftPanel, BorderLayout.WEST);
            topStrip.add(rightPanel, BorderLayout.EAST);
            add(topStrip, BorderLayout.NORTH);

            // Scroll panes with line numbers (RTextScrollPane has gutter built-in)
            RTextScrollPane inputScroll = codePane(inputArea, "Source");
            RTextScrollPane outputScroll = codePane(outputArea, "Output");

            JSplitPane ioSplit = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, inputScroll, outputScroll);
            ioSplit.setResizeWeight(0.5);
            add(ioSplit, BorderLayout.CENTER);

            JButton translateBtn = new JButton("Translate");
            translateBtn.addActionListener(this::onTranslate);

            JButton clearBtn = new JButton("Clear");
            clearBtn.addActionListener(e -> { inputArea.setText(""); outputArea.setText(""); statusLabel.setText("Cleared."); });

            JButton backBtn = new JButton("Back");
            backBtn.addActionListener(e -> { new StartFrame().setVisible(true); dispose(); });

            JPanel buttons = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
            buttons.add(translateBtn); buttons.add(clearBtn); buttons.add(backBtn);

            JPanel bottom = new JPanel(new BorderLayout(8,0));
            bottom.add(buttons, BorderLayout.WEST);
            bottom.add(statusLabel, BorderLayout.CENTER);
            add(bottom, BorderLayout.SOUTH);

            setMinimumSize(new Dimension(900, 560));
            pack();
            setLocationRelativeTo(null); // center on screen
        }

        private void onTranslate(ActionEvent e) {
            String inputLang = oddBtn.isSelected() ? "ODD" : "COD";
            String target    = propBtn.isSelected() ? "PROP" : "SMT";
            String src       = inputArea.getText();
            if (src.trim().isEmpty()) { statusLabel.setText("Nothing to translate."); return; }

            String result = "PROP".equals(target)
                    ? Translators.translateToPropositional(src, inputLang)
                    : Translators.translateToSmtLib(src, inputLang);

            // Output style: propositional as plain text, SMT as Lisp-ish
            outputArea.setSyntaxEditingStyle("PROP".equals(target)
                    ? SyntaxConstants.SYNTAX_STYLE_NONE
                    : SyntaxConstants.SYNTAX_STYLE_LISP);
            outputArea.setText(result);
            outputArea.setCaretPosition(0);
            statusLabel.setText("Translated from " + inputLang + " to " + ("PROP".equals(target) ? "Propositional Logic" : "SMT-LIB") + ".");
        }
    }

    // ---------- Verify Window (multi-module + line numbers; UI-only ':' stripping) ----------
    static class VerifyFrame extends JFrame {

        // ODD/COD inputs highlighted as YAML; SMT outputs as Lisp-like
        private final RSyntaxTextArea oddInput  = makeSyntaxEditor(true,  SyntaxConstants.SYNTAX_STYLE_YAML);
        private final RSyntaxTextArea oddSmt    = makeSyntaxEditor(false, SyntaxConstants.SYNTAX_STYLE_LISP);
        private final RSyntaxTextArea codInput  = makeSyntaxEditor(true,  SyntaxConstants.SYNTAX_STYLE_YAML);
        private final RSyntaxTextArea codSmt    = makeSyntaxEditor(false, SyntaxConstants.SYNTAX_STYLE_LISP);
        private final RSyntaxTextArea verifyOut = makeSyntaxEditor(false, SyntaxConstants.SYNTAX_STYLE_NONE);

        private final JCheckBox checkSat = new JCheckBox("check-sat", true);
        private final JCheckBox getModel = new JCheckBox("get-model");
        private final JCheckBox excludeCod = new JCheckBox("Exclude COD");

        // Multi-select list of modules to assert (shown WITHOUT trailing ':')
        private final DefaultListModel<String> moduleListModel = new DefaultListModel<>();
        private final JList<String> moduleList = new JList<>(moduleListModel);

        private final JButton refreshModulesBtn     = new JButton("Refresh Modules");
        private final JButton translateBtn          = new JButton("Translate");
        private final JButton verifyBtn             = new JButton("Verify");
        private final JButton showCombinedBtn       = new JButton("Show Combined SMT-LIB"); // NEW
        private final JButton copyCombinedBtn       = new JButton("Copy Combined SMT-LIB");
        private final JButton backBtn               = new JButton("Back");

        private final JLabel status = new JLabel("Ready.");

        // ---- gating: Verify disabled until Translate on current inputs ----
        private boolean inputsDirty = true;  // start dirty so Verify is disabled

        private void markDirty() {
            inputsDirty = true;
            verifyBtn.setEnabled(false);
            status.setText("Inputs changed — click Translate before Verify.");
        }

        private void markClean() {
            inputsDirty = false;
            verifyBtn.setEnabled(true);
        }

        VerifyFrame() {
            super("Verify");
            setDefaultCloseOperation(EXIT_ON_CLOSE);
            setLayout(new BorderLayout(10, 10));
            ((JComponent)getContentPane()).setBorder(BorderFactory.createEmptyBorder(10,10,10,10));

            // Column: ODD
            JPanel oddCol = new JPanel(new BorderLayout(6,6));
            oddCol.setBorder(titled("ODD"));
            RTextScrollPane oddInScroll  = codePane(oddInput, "ODD – Input");
            RTextScrollPane oddOutScroll = codePane(oddSmt,   "SMT-LIB (ODD)");
            JSplitPane oddSplit = new JSplitPane(JSplitPane.VERTICAL_SPLIT, oddInScroll, oddOutScroll);
            oddSplit.setResizeWeight(0.5);
            oddCol.add(oddSplit, BorderLayout.CENTER);

            // Column: COD
            JPanel codCol = new JPanel(new BorderLayout(6,6));
            codCol.setBorder(titled("COD"));
            RTextScrollPane codInScroll  = codePane(codInput, "COD – Input");
            RTextScrollPane codOutScroll = codePane(codSmt,   "SMT-LIB (COD)");
            JSplitPane codSplit = new JSplitPane(JSplitPane.VERTICAL_SPLIT, codInScroll, codOutScroll);
            codSplit.setResizeWeight(0.5);
            codCol.add(codSplit, BorderLayout.CENTER);

            // Two columns side-by-side
            JSplitPane columns = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, oddCol, codCol);
            columns.setResizeWeight(0.5);

            // Verification Result (full width)
            RTextScrollPane verifyScroll = codePane(verifyOut, "Verification Result");
            verifyOut.setLineWrap(true);
            verifyOut.setWrapStyleWord(true);

            JSplitPane center = new JSplitPane(JSplitPane.VERTICAL_SPLIT, columns, verifyScroll);
            center.setResizeWeight(0.75);
            add(center, BorderLayout.CENTER);

            // Module selection panel (right side)
            moduleList.setVisibleRowCount(6);
            moduleList.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
            JScrollPane moduleScroll = new JScrollPane(moduleList);
            moduleScroll.setPreferredSize(new Dimension(260, 120));
            moduleScroll.setBorder(titled("Assert module(s)"));
            refreshModulesBtn.addActionListener(e -> refreshModules());

            JPanel modulePanel = new JPanel(new BorderLayout(6,6));
            modulePanel.add(moduleScroll, BorderLayout.CENTER);
            modulePanel.add(refreshModulesBtn, BorderLayout.SOUTH);

            // Bottom controls
            translateBtn.addActionListener(e -> doTranslate(true));
            verifyBtn.addActionListener(e -> doVerify());
            showCombinedBtn.addActionListener(e -> showCombined()); // NEW
            copyCombinedBtn.addActionListener(e -> copyCombinedToClipboard());
            backBtn.addActionListener(e -> { new StartFrame().setVisible(true); dispose(); });

            JPanel leftBtns = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
            leftBtns.add(translateBtn);
            leftBtns.add(verifyBtn);
            leftBtns.add(showCombinedBtn);   // NEW
            leftBtns.add(copyCombinedBtn);
            leftBtns.add(backBtn);

            JPanel rightOpts = new JPanel(new BorderLayout(8, 6));
            JPanel checks = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
            checks.add(checkSat);
            checks.add(getModel);
            checks.add(excludeCod); // NEW
            rightOpts.add(checks, BorderLayout.NORTH);
            rightOpts.add(modulePanel, BorderLayout.SOUTH);

            JPanel bottom = new JPanel(new BorderLayout(8,0));
            bottom.add(leftBtns, BorderLayout.WEST);
            bottom.add(rightOpts, BorderLayout.EAST);

            JPanel footer = new JPanel(new BorderLayout(8,0));
            footer.add(bottom, BorderLayout.NORTH);
            footer.add(status, BorderLayout.SOUTH);

            add(footer, BorderLayout.SOUTH);

            setMinimumSize(new Dimension(1250, 800));
            pack();
            setLocationRelativeTo(null); // center on screen

            // ---- Verify gating: disable Verify initially, re-disable on edits ----
            verifyBtn.setEnabled(false);
            DocumentListener dirtyListener = new DocumentListener() {
                public void insertUpdate(DocumentEvent e) { markDirty(); }
                public void removeUpdate(DocumentEvent e) { markDirty(); }
                public void changedUpdate(DocumentEvent e) { markDirty(); }
            };
            oddInput.getDocument().addDocumentListener(dirtyListener);
            codInput.getDocument().addDocumentListener(dirtyListener);

            // Initialize module list once at startup (empty until user translates)
            refreshModules();
        }

        /** UI-only sanitization: trim + remove any trailing ':' characters. */
        private static String sanitizeModule(String raw) {
            if (raw == null) return "";
            String s = raw.trim();
            return s.replaceAll(":+$", ""); // drop one or more trailing colons
        }

        /** Translate ODD/COD to SMT-LIB; optionally also refresh module list from ODD input. */
        private void doTranslate(boolean alsoRefreshModules) {
            String oddSrc = oddInput.getText();
            String codSrc = codInput.getText();
            String oddOut = oddSrc.trim().isEmpty() ? "" : Translators.translateToSmtLib(oddSrc, "ODD");
            String codOut = codSrc.trim().isEmpty() ? "" : Translators.translateToSmtLib(codSrc, "COD");
            oddSmt.setText(oddOut);
            codSmt.setText(codOut);
            oddSmt.setCaretPosition(0);
            codSmt.setCaretPosition(0);
            status.setText("Translated to SMT-LIB" +
                    (checkSat.isSelected() || getModel.isSelected()
                            ? " (options selected: " +
                            (checkSat.isSelected() ? "check-sat " : "") +
                            (getModel.isSelected() ? "get-model" : "") + ")"
                            : "."));
            if (alsoRefreshModules) refreshModules();
            // mark clean so Verify is enabled now
            markClean();
        }

        private void refreshModules() {
            try {
                List<String> raw = Translators.extractOddModuleNames(oddInput.getText());
                // Deduplicate by sanitized name and show sanitized names in the UI
                LinkedHashSet<String> uniq = new LinkedHashSet<>();
                for (String r : raw) {
                    String s = sanitizeModule(r);
                    if (!s.isBlank()) uniq.add(s);
                }
                moduleListModel.clear();
                for (String m : uniq) moduleListModel.addElement(m);
                if (!uniq.isEmpty()) {
                    moduleList.setSelectedIndex(0);
                    status.setText("Modules loaded: " + uniq.size());
                } else {
                    status.setText("No modules found in ODD.");
                }
            } catch (Exception ex) {
                moduleListModel.clear();
                status.setText("Failed to parse ODD modules: " + ex.getMessage());
            }
        }

        /** Build combined SMT-LIB with optional asserts and commands. */
        private String buildCombinedScript(boolean appendCommands, java.util.List<String> modulesToAssert) {
            StringBuilder sb = new StringBuilder();
            String odd = oddSmt.getText().trim();
            String cod = codSmt.getText().trim();

            if (!odd.isEmpty()) {
                sb.append("; --- ODD ---\n").append(odd);
                if (!odd.endsWith("\n")) sb.append("\n");
            }
            // Only include COD when NOT excluded
            if (!excludeCod.isSelected() && !cod.isEmpty()) { // CHANGED
                sb.append("; --- COD ---\n").append(cod);
                if (!cod.endsWith("\n")) sb.append("\n");
            }

            if (modulesToAssert != null && !modulesToAssert.isEmpty()) {
                sb.append("; --- Assert selected module(s) ---\n");
                for (String m : modulesToAssert) {
                    String sym = sanitizeModule(m);
                    if (!sym.isBlank()) {
                        sb.append("(assert ").append(sym).append(")\n");
                    }
                }
            }

            if (appendCommands) {
                boolean needsCheckSat = checkSat.isSelected() || getModel.isSelected();
                if (needsCheckSat) sb.append("(check-sat)\n");
                if (getModel.isSelected()) sb.append("(get-model)\n");
            }
            return sb.toString();
        }

        private void copyCombinedToClipboard() {
            java.util.List<String> selected = moduleList.getSelectedValuesList();
            String script = buildCombinedScript(true, selected);
            StringSelection sel = new StringSelection(script);
            Clipboard cb = Toolkit.getDefaultToolkit().getSystemClipboard();
            cb.setContents(sel, sel);
            status.setText("Combined SMT-LIB copied to clipboard" +
                    (checkSat.isSelected() || getModel.isSelected() ? " (with commands)." : "."));
        }

        private void setBusy(boolean busy) {
            translateBtn.setEnabled(!busy);
            verifyBtn.setEnabled(!busy && !inputsDirty); // obey gating even when toggling busy
            showCombinedBtn.setEnabled(!busy);
            copyCombinedBtn.setEnabled(!busy);
            backBtn.setEnabled(!busy);
            refreshModulesBtn.setEnabled(!busy);
            moduleList.setEnabled(!busy);
            setCursor(Cursor.getPredefinedCursor(busy ? Cursor.WAIT_CURSOR : Cursor.DEFAULT_CURSOR));
        }

        private void doVerify() {
            // Enforce "translate first" if inputs changed
            if (inputsDirty) {
                status.setText("Translate first: inputs changed.");
                return;
            }

            java.util.List<String> selected = moduleList.getSelectedValuesList();
            String script = buildCombinedScript(true, selected);

            if (script.isBlank()) {
                status.setText("Nothing to verify — provide ODD and/or COD SMT-LIB.");
                return;
            }

            setBusy(true);
            verifyOut.setText("");
            // Show sanitized names in status
            java.util.List<String> pretty = new ArrayList<>();
            for (String m : selected) pretty.add(sanitizeModule(m));
            status.setText("Verifying" + (!pretty.isEmpty() ? " (assert " + String.join(", ", pretty) + ")" : "") + "...");

            new SwingWorker<String, Void>() {
                @Override protected String doInBackground() {
                    return Translators.verifySmt(script);
                }
                @Override protected void done() {
                    try {
                        String result = get();
                        verifyOut.setText(result == null ? "" : result);
                        verifyOut.setCaretPosition(0);
                        status.setText("Verification finished.");
                    } catch (Exception ex) {
                        verifyOut.setText("Error during verification:\n" + ex.getMessage());
                        status.setText("Verification failed.");
                    } finally {
                        setBusy(false);
                    }
                }
            }.execute();
        }

        // ---------- NEW: show combined SMT-LIB in a separate window ----------
        private void showCombined() {
            if (inputsDirty) {
                status.setText("Translate first: inputs changed.");
                return;
            }
            java.util.List<String> selected = moduleList.getSelectedValuesList();
            String script = buildCombinedScript(true, selected);
            if (script.isBlank()) {
                status.setText("Nothing to show — provide ODD and/or COD SMT-LIB.");
                return;
            }
            new CombinedSmtFrame(this, script).setVisible(true);
        }

        /** Small viewer window for combined SMT-LIB. */
        private static class CombinedSmtFrame extends JFrame {
            CombinedSmtFrame(Window owner, String content) {
                super("Combined SMT-LIB");
                setDefaultCloseOperation(DISPOSE_ON_CLOSE);
                setLayout(new BorderLayout(8,8));

                RSyntaxTextArea ta = makeSyntaxEditor(false, SyntaxConstants.SYNTAX_STYLE_LISP);
                ta.setText(content);
                ta.setCaretPosition(0);
                ta.setLineWrap(false);
                ta.setWrapStyleWord(false);

                RTextScrollPane sp = codePane(ta, "Combined SMT-LIB");
                add(sp, BorderLayout.CENTER);

                JButton copyBtn = new JButton("Copy");
                copyBtn.addActionListener(e -> {
                    StringSelection sel = new StringSelection(content);
                    Clipboard cb = Toolkit.getDefaultToolkit().getSystemClipboard();
                    cb.setContents(sel, sel);
                });
                JPanel south = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 8));
                south.add(copyBtn);
                add(south, BorderLayout.SOUTH);

                setMinimumSize(new Dimension(800, 600));
                pack();
                setLocationRelativeTo(owner);
            }
        }
    }


    // ---------- Shared UI helpers ----------

    private static TitledBorder titled(String title) {
        return BorderFactory.createTitledBorder(
                BorderFactory.createEtchedBorder(), title,
                TitledBorder.LEADING, TitledBorder.TOP);
    }

    /** Create a configured RSyntaxTextArea with an appropriate style. */
    private static RSyntaxTextArea makeSyntaxEditor(boolean editable, String syntaxStyle) {
        RSyntaxTextArea ta = new RSyntaxTextArea();
        ta.setEditable(editable);
        ta.setCodeFoldingEnabled(true);
        ta.setAntiAliasingEnabled(true);
        ta.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        ta.setSyntaxEditingStyle(syntaxStyle == null ? SyntaxConstants.SYNTAX_STYLE_NONE : syntaxStyle);
        ta.setBorder(BorderFactory.createEmptyBorder(6,6,6,6));
        return ta;
    }

    /** Wrap an RSyntaxTextArea in an RTextScrollPane with a titled border and line numbers. */
    private static RTextScrollPane codePane(RSyntaxTextArea ta, String title) {
        RTextScrollPane sp = new RTextScrollPane(ta);
        sp.setLineNumbersEnabled(true);
        if (title != null && !title.isBlank()) sp.setBorder(titled(title));
        return sp;
    }

    // (Keeping your old JTextArea helpers in case you still use them elsewhere)
    private static JTextArea makeMonoArea(boolean editable) {
        JTextArea ta = new JTextArea();
        ta.setEditable(editable);
        ta.setLineWrap(true);
        ta.setWrapStyleWord(true);
        ta.setFont(new Font(Font.MONOSPACED, Font.PLAIN, 13));
        ta.setBorder(BorderFactory.createEmptyBorder(6,6,6,6));
        return ta;
    }
    private static JScrollPane withLineNumbers(JTextArea ta, String titled) {
        JScrollPane sp = new JScrollPane(ta);
        if (titled != null && !titled.isBlank()) sp.setBorder(titled(titled));
        JTextArea ln = new JTextArea("1");
        ln.setEditable(false);
        ln.setFocusable(false);
        ln.setBackground(new Color(245,245,245));
        ln.setFont(ta.getFont());
        ln.setBorder(BorderFactory.createEmptyBorder(6,4,6,4));
        sp.setRowHeaderView(ln);

        DocumentListener dl = new DocumentListener() {
            private void update() {
                SwingUtilities.invokeLater(() -> {
                    int lines = ta.getLineCount();
                    StringBuilder sb = new StringBuilder(Math.max(16, lines * 3));
                    for (int i = 1; i <= lines; i++) sb.append(i).append('\n');
                    ln.setText(sb.toString());
                });
            }
            public void insertUpdate(DocumentEvent e) { update(); }
            public void removeUpdate(DocumentEvent e) { update(); }
            public void changedUpdate(DocumentEvent e) { update(); }
        };
        ta.getDocument().addDocumentListener(dl);

        SwingUtilities.invokeLater(() -> {
            int lines = ta.getLineCount();
            StringBuilder sb = new StringBuilder(Math.max(16, lines * 3));
            for (int i = 1; i <= lines; i++) sb.append(i).append('\n');
            ln.setText(sb.toString());
        });

        return sp;
    }

    // ---------- Translators & Z3 ----------
    public static class Translators {

        // ---- UI entry points ----

        public static String translateToSmtLib(String src, String inputLang) {
            try {
                if ("ODD".equalsIgnoreCase(inputLang)) {
                    return oddToSmt(src);
                } else if ("COD".equalsIgnoreCase(inputLang)) {
                    return codToSmt(src);
                } else {
                    return error("Unknown input language: " + inputLang);
                }
            } catch (Exception ex) {
                return error("SMT-LIB translation error: " + ex.getMessage());
            }
        }

        static String translateToPropositional(String src, String inputLang) {
            try {
                if ("ODD".equalsIgnoreCase(inputLang)) {
                    return oddToProp(src);
                } else if ("COD".equalsIgnoreCase(inputLang)) {
                    return codToProp(src);
                } else {
                    return error("Unknown input language: " + inputLang);
                }
            } catch (Exception ex) {
                return error("Propositional translation error: " + ex.getMessage());
            }
        }

        static String verifySmt(String scriptWithCmds) {
            Context ctx = null;
            try {
                String cleaned = stripCommands(scriptWithCmds);

                ctx = new Context(new java.util.HashMap<>());
                BoolExpr[] constraints = ctx.parseSMTLIB2String(cleaned, null, null, null, null);
                Solver solver = ctx.mkSolver();
                if (constraints != null) for (BoolExpr c : constraints) solver.add(c);

                Status result = solver.check();
                StringBuilder out = new StringBuilder();
                out.append("Result: ").append(result).append("\n");

                if (result == Status.SATISFIABLE && scriptWithCmds.contains("(get-model)")) {
                    out.append("Model:\n").append(solver.getModel()).append("\n");
                } else if (result == Status.UNKNOWN) {
                    out.append("Reason (unknown): ").append(solver.getReasonUnknown()).append('\n');
                }
                return out.toString().trim();
            } catch (Z3Exception z3ex) {
                return error("Z3 Error: " + z3ex.getMessage());
            } catch (Exception ex) {
                return error("Verification error: " + ex.getMessage());
            } finally {
                if (ctx != null) ctx.close();
            }
        }

        /** Remove (check-sat) / (get-model) commands safely before Z3's parseSMTLIB2String. */
        private static String stripCommands(String s) {
            String[] lines = s.replace("\r\n","\n").split("\n");
            StringBuilder sb = new StringBuilder();
            for (String line : lines) {
                String t = line.trim();
                if (t.equals("(check-sat)") || t.equals("(get-model)")) continue;
                sb.append(line).append('\n');
            }
            return sb.toString();
        }

        /** Extract module names from ODD using your grammar: module : ID logicalexpression+ | statement; */
        static List<String> extractOddModuleNames(String src) {
            if (src == null || src.isBlank()) return Collections.emptyList();
            CodePointCharStream input = CharStreams.fromString(src);
            ODDLexer lexer = new ODDLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            ODDParser parser = new ODDParser(tokens);
            ParseTree tree = parser.input();

            class ModuleCollector extends ODDBaseVisitor<Void> {
                final List<String> names = new ArrayList<>();
                @Override public Void visitModule(ODDParser.ModuleContext ctx) {
                    if (ctx.ID() != null) names.add(ctx.ID().getText());
                    return visitChildren(ctx);
                }
            }
            ModuleCollector mc = new ModuleCollector();
            mc.visit(tree);
            return mc.names;
        }

        // ---- Implementations using your visitors ----

        private static String oddToSmt(String src) {
            CodePointCharStream input = CharStreams.fromString(src);
            ODDLexer lexer = new ODDLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            ODDParser parser = new ODDParser(tokens);
            ParseTree tree = parser.input();

            ODDVistorSMTLIB visitor = new ODDVistorSMTLIB();
            return visitor.visit(tree);
        }

        private static String oddToProp(String src) {
            CodePointCharStream input = CharStreams.fromString(src);
            ODDLexer lexer = new ODDLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            ODDParser parser = new ODDParser(tokens);
            ParseTree tree = parser.input();

            ODDVisitorPropositionalLogic visitor = new ODDVisitorPropositionalLogic();
            return visitor.visit(tree);
        }

        private static String codToSmt(String src) {
            CodePointCharStream input = CharStreams.fromString(src);
            CODLexer lexer = new CODLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            CODParser parser = new CODParser(tokens);
            ParseTree tree = parser.input();

            CODVisitorSMTLIB visitor = new CODVisitorSMTLIB();
            return visitor.visit(tree);
        }

        private static String codToProp(String src) {
            CodePointCharStream input = CharStreams.fromString(src);
            CODLexer lexer = new CODLexer(input);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            CODParser parser = new CODParser(tokens);
            ParseTree tree = parser.input();

            CODVisitorPropositionalLogic visitor = new CODVisitorPropositionalLogic();
            return visitor.visit(tree);
        }

        // ---- helpers ----
        private static String normalizeNewlines(String s) { return s.replace("\r\n", "\n"); }
        private static String error(String msg) { return ";; ERROR: " + msg; }
    }
}

## Copyright (C) 2024, Nicholas Carlini <nicholas@carlini.com>.
##
## This program is free software: you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.
##
## This program is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program.  If not, see <http://www.gnu.org/licenses/>.


# This file is terrible code.
# In my defense it's mostly Aided using standard development resources.
# I am very sorry.
# At some point I might clean it up.

import markdown
import ast
from PIL import Image
import numpy as np
import io
import re

import pygments.lexers
from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter

from evaluator import *

def fix(x):
    if type(x) != str:
        x = str(x)
    if x.count("```")%2 == 1:
        x = x + "\n```"
    return "\n".join("> "+line for line in x.split("\n"))

def format_markdown(reason, indent=0):
    """
    Convert a Reason object into a markdown string that explains how we got to the result.
    """

    pounds = "#" * (indent+1)
    if reason.node in (AndNode, OrNode):
        word = "all" if reason.node == AndNode else "any"
        out = "{} Check if {} of the following conditions are true:
".format(pounds, word)
        same_type = reason.node
        
        and_node = reason
        while and_node.node == same_type:
            out += format_markdown(and_node.children[1], indent+1)+"\n"
            and_node = and_node.children[0]
        out += format_markdown(and_node, indent+1)+"\n"
        
        out += "

{}# Final Answer: {}".format(pounds, reason.children[2])
        return out
    elif reason.node == NotNode:
        return "{} Check this condition is not true:
{}

{}# Final Answer: {}".format(pounds, format_markdown(reason.children[0], indent+1), pounds, reason.children[1])
    elif reason.node == ThenNode: # has to be after and/or because children
        return format_markdown(reason.children[0], indent) +\
            "\n" + format_markdown(reason.children[1], indent)
    elif reason.node == StringNode:
        return "{} Initial Query
{}
".format(pounds, fix(reason.children.strip()))
    elif reason.node == Setup:
        return "{} Docker Setup
I have setup the docker container to run the model evaluation.".format(pounds)
    elif reason.node == SeleniumDraw:
        return "{} HTML Render
Rendering the webpage gives the following image:
{}
".format(pounds, reason.children)
    elif reason.node in (LLMRun, LLMVisionRun, LLMConversation):
        return "{} LLM Generation
#{} Query
{}
#{} Output
{}
".format(pounds, pounds, fix(reason.children[0].strip()), pounds, fix(reason.children[1].strip()))
    elif reason.node in (PythonRun, CRun, CppRun, RustRun, BashRun, TerminalRun, SQLRun):
        return "{} Run Code Interpreter
Running the following program:
> ```
{}
> ```
And got the output:
```
{}
```
".format(pounds, fix(reason.children[0].strip()), reason.children[1])
    elif reason.node == ExtractCode:
        return "{} Extract Code
I extracted the following code from that output:
> ```
{}
> ```
".format(pounds, fix(reason.children.strip()))
    elif reason.node == ExtractJSON:
        return "{} Extract Json
I extracted the following JSON from that output:
> ```json
{}
> ```
".format(pounds, fix(reason.children[0]))
    elif reason.node == SubstringEvaluator:
        return "{} Substring Evaluation
Testing if the previous output contains the string `{}`: {}
".format(pounds, reason.children[0], reason.children[1])
    elif reason.node == RegexEvaluator:
        return "{} Regex Evaluation
Testing if the previous output matches the regex `{}`: {}
".format(pounds, reason.children[0], reason.children[1])
    elif reason.node == EqualEvaluator:
        return "{} Equal Evaluation
Testing if the previous output equals the string `{}`: {}
".format(pounds, reason.children[0], reason.children[1])
    elif reason.node == ContainsIntEvaluator:
        return "{} Contains Int Evaluation
Testing if the previous output contains the integers `{}`: {}
".format(pounds, reason.children[0], reason.children[1])
    elif reason.node == JSONSubsetEvaluator:
        return "{} JSON Subset Evaluator
Testing if the previous output matches the JSON: `{}`: {}
".format(pounds, json.dumps(reason.children[0], indent=4), reason.children[1])
    elif reason.node in (PyFunc, MakeFile, PyEvaluator):
        return "{} PyFunc
{}
Resulting in output:
{}".format(pounds, fix(reason.children[0]), fix(reason.children[1])).replace("\n\n","\n")
    elif reason.node == SendStdoutReceiveStdin:
        return "{} Send to Process Stdout
{}".format(pounds, fix(reason.children[0]))
    elif reason.node == UntilDone:
        out = "{} Looping until done
".format(pounds)
        for iteration,sub in enumerate(reason.children):
            out += "{}# Iteration {}
".format(pounds, iteration)
            out += format_markdown(sub, indent+2)+"\n"
        return out
    elif reason.node == Echo:
        return ""
    else:
        return "UNKNOWN NODE TYPE: " + repr(reason.node)


def generate_report(data, tags, descriptions):
    reasons = {key: {k1: v1[1] for k1,v1 in value.items()} for key, value in data.items()}
    data = {key: {k1: v1[0] for k1,v1 in value.items()} for key, value in data.items()}

    for k in reasons:
        for k1 in reasons[k]:
            for i in range(len(reasons[k][k1])):
                if isinstance(reasons[k][k1][i], Reason):
                    fmt = format_markdown(reasons[k][k1][i])
                    while '\n\n' in fmt:
                        fmt = fmt.replace('\n\n', '\n')
                    fmt = fmt.replace("\n#", "\n\n#")
                    reasons[k][k1][i] = fmt


    #all_tests = sorted({key for inner_dict in data.values() for key in inner_dict.keys()})
    all_tests = [inner_dict.keys() for inner_dict in data.values()]

    print(all_tests)
    
    # keep only the tests that are in all models
    union_tests = set.union(*map(set, all_tests))
    all_tests = set.intersection(*map(set, all_tests))

    print("Skipping", union_tests - all_tests)
    
    all_tests = sorted(all_tests)

    #all_tests = ["draw_flag_bmp.py.TestEasyFlagDraw"]

    if len(all_tests) == 0:
        raise ValueError("No tests in common between models")
    
    all_models = []
    score_table = []
    
    for model_name, inner_dict in data.items():
        all_models.append(model_name)
        score_table.append([np.mean(inner_dict[k]) for k in all_tests])

    score_table = np.array(score_table)


    row_weight_vec = np.array([1]*len(all_models))
    col_weight_vec = np.array([1]*len(all_tests))
    
    # Weight tests and models according to how easy/good they are
    # It's less impressive if a model can solve an easy test, and so it gets fewer points.
    # Similarly, a test probably isn't very hard if even bad models can solve it.
    for _ in range(1):
        row_means = (score_table * (row_weight_vec[:,None] + .1)).mean(0)
        column_means = (score_table / (col_weight_vec[None,:] + .1)).mean(1)

        col_weight_vec = row_means/row_means.mean()
        row_weight_vec = column_means/column_means.mean()

    row_means_, column_means_ = row_means, column_means
    
    column_means = dict(zip(all_tests, row_means_))
    row_means = dict(zip(all_models, column_means_))
    
    sorted_columns = sorted(all_tests, key=lambda x: column_means[x], reverse=True)
    sorted_rows = sorted(data.keys(), key=lambda x: row_means[x], reverse=True)


    # Transposing the data: columns become rows and rows become columns.
    transposed_data = {}
    for column in sorted_columns:
        transposed_data[column] = {row: (data[row][column]) for row in sorted_rows if column in data[row]}

    # Sorting the transposed columns (originally rows) by their mean correctness
    sorted_transposed_columns = sorted(transposed_data.keys(), key=lambda x: column_means[x], reverse=True)

    # Sorting the transposed rows (originally columns) by their mean correctness
    sorted_transposed_rows = sorted(transposed_data[sorted_transposed_columns[0]].keys(), key=lambda x: row_means[x], reverse=True)

    # Creating the HTML content with transposed and sorted rows and columns
    html_content = "<html><head><style>td, th {border: 1px solid black; padding: 10px;}</style></head><body>"

    tag_values = set(sum([tags[key] for key in tags], []))

    for tag in tag_values:
        html_content += "<span><input type='checkbox' onclick='hiderows()' id='" + tag + "' name='" + tag + "' value='" + tag + "' checked='checked'><label for='" + tag + "'/>" + tag + "</label> | </span>"

    html_content += """<script>
function hiderows() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var notchecked = Array.prototype.slice.call(checkboxes).filter(cb => !cb.checked).map(cb => cb.value);
    var rows = document.querySelectorAll('tr');
    // show a row if all of the tags applies
    Array.prototype.slice.call(rows).forEach((row,id) => {
    if (id == 0) return;
    // allow th special
        if (notchecked.every(tag=>!row.getAttribute('tag_'+tag))) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}
</script>
    
    <style>
      span.footnote {
          position: relative;
          width: 0px;
          margin-left: -.3em;
      }
      
      span.footnote > a:first-child {
          vertical-align: super;
          font-size: .7em;
          line-height: 100%;
          margin-left: 2px;
      }
      
      .footnote_content {
          padding: .2em;
          margin: 0px;
          background: #ffffff;
          opacity: 0.95;
          border: #aaa 1px solid;
          position: absolute;
          display: block;
          left: 0px;
          margin-left: 1em;
          margin-right: 1em;
          width: 20em;
          border-radius: 2px;
          visibility: hidden;
          transition: 0.2s .2s;
          box-shadow: 0px 2px 10px 2px rgba(0,0,0,.25);
          z-index: 100;
      }
    
      .footnote:hover .footnote_content  {
          visibility: visible;
          transition-delay: 0s;
      }
    </style>
"""


    html_content += "<table>"
    # Adding the transposed sorted header row (originally columns, now rows)
    html_content += "<tr><th>Question</th>" + "".join(["<th>{}<br/>({}%)</th>".format(key, int(score_table.mean(1)[all_models.index(key)]*100)) for key in sorted_transposed_rows]) + "</tr>"

    if not os.path.exists("evaluation_examples"):
        os.mkdir("evaluation_examples")
    
    # Adding transposed sorted rows (originally keys from inner dictionaries, now columns)
    for idx,column_key in enumerate(sorted_transposed_columns):
        print(column_key)
        if column_key not in tags:
            this_tags = []
            this_description = ""
            print("BAD", tags, column_key)
        else:
            this_tags = tags[column_key]
            this_description = descriptions[column_key]

        test_case = open("tests/"+column_key.split(".py")[0]+".py", "r").read()

        test_case = "<style>" + HtmlFormatter().get_style_defs('.highlight') + "</style>" + highlight(test_case, PythonLexer(), HtmlFormatter(linenos=True, style='colorful'))
        
        open("evaluation_examples/"+column_key.split(".py")[0]+".html", "w").write(test_case)

        
        format_column_key = '<a href="{}">{}</a>'.format(column_key.split(".py")[0]+".html", column_key.split(".Test")[1])
        format_column_key = '
        <span class="footnote" id="footnote{}">
          <a href="#footnote{}">
            <label for="foot">{}</label>
          </a>
          <span class="footnote_content">
            {}
          </span>
        </span>
        '.format(idx, idx, format_column_key, this_description)

        html_content += f"""<tr {' '.join('tag_%s="1"'%x for x in this_tags)}><th>{format_column_key}<br/>tags: {', '.join(this_tags)}</td>"""
        for row_key in sorted_transposed_rows:
            arr = transposed_data[column_key].get(row_key)
            correct, total = sum(arr), len(arr)
            value = "{}/{}".format(correct, total)
            int_value = correct/total
            # Color coding the cell or leaving it blank if the value is None
            link = column_key+"_"+row_key+".html"
            cell_html = "<td style='background-color: rgb{};'><a href='{}#tab1'>{}</a></td>".format(convert_to_color_through_yellow(int_value), link, str(value)) if value is not None else "<td></td>"
            html_content += cell_html
        html_content += "</tr>"

    # Closing the table and HTML tags.
    html_content += "</table></body></html>"
    
    # Saving the HTML content to a new file
    html_file_path_transposed_sorted = "evaluation_examples/index.html"
    with open(html_file_path_transposed_sorted, "w") as file:
        file.write(html_content)

    css = """
    <style>
      body {
      }
    code {
        white-space: pre-wrap;
        display: block;
        margin: 1em;
        padding: 1em;
        background: #eee;
        border-radius: .5em;
    }
    </style>
    """

    tabbed = """
    <style>
    
        body {
            font-family: Arial, sans-serif;
        }

    .is_correct_0 {
      background: rgb(255, 170, 170);
    }

    .is_correct_1 {
      background: rgb(170, 255, 170);
    }

        p {margin: 0em; }
        h1 {margin: 0em; }
        h2 {margin: 0em; }
        h3 {margin: 0em; }
        h4 {margin: 0em; }
        h5 {margin: 0em; }
        h6 {margin: 0em; }
        h7 {margin: 0em; }
        h8 {margin: 0em; }

        
    
        .tabs {
            list-style-type: none;
            overflow: hidden;
            background-color: #eef;
            position: fixed;
            top: 0px;
            width: 100%%;
            padding: .2em;
            margin: 0;
        }

        .tabs li {
            float: left;
        }

        .tabs li a {
            display: block;
            color: black;
            text-align: center;
            padding: 14px 16px;
            text-decoration: none;
            transition: 0.3s;
            background-color: inherit;
            border: 1px solid #ddd;
            border-bottom: none;
            transition: filter 0.3s ease; 
        }


        .tabs li a:hover {
            filter: brightness(120%%); /* Increase brightness on hover */
        }

        .tab-content {
            white-space: pre-wrap;
            display: none;
            padding: 20px;
        }

        .tab-content:target {
            padding-top: 2em;
            display: block;
        }
    </style>
    
<ul class="tabs">
    <li><a href="index.html">Full Grid</a></li> %s
</ul>
    
<div class="clear-float"></div>
    """
    one_tab = """
<div id="tab{}" class="tab-content">
    {}
</div>
    """
    
        
    for column_key in sorted_transposed_columns:
        for row_key in sorted_transposed_rows:

            ok = data[row_key][column_key]
            example_html = tabbed%("".join('<li class="ARG-{}"><a href="#tab{}">Trial {}</a></li>'.format(i, i+1, i+1) for i in range(len(ok))))
            for i in range(len(ok)):
                example_html = example_html.replace("ARG-"+str(i), "is_correct_"+str(int(ok[i])))
            
            table = []
            for idx,output in enumerate(reasons[row_key][column_key]):

                output = output.split("\n")
                remap = {}
                j = 0
                for i,x in enumerate(output):
                    if x[:1] == '>':
                        output[i] = "ZZLINE_"+str(j)+"END"
                        remap["ZZLINE_"+str(j)+"END"] = x[2:]
                        j += 1


                for i in range(len(output)):
                    line = output[i]
                    if len(line) > 1000:
                        if line.startswith("b'"):
                            try:
                                actual_bytes = ast.literal_eval(line)
                                image = Image.open(io.BytesIO(actual_bytes))
                                image.save("evaluation_examples/"+column_key+"_"+row_key+"_"+str(idx)+"_"+str(i)+".png")
                                output[i] = "sudo_make_me_an_image["+column_key+"_"+row_key+"_"+str(idx)+"_"+str(i)+".png]"

                            except Exception as e:
                                pass
                                
                output = "\n".join([x[:10000] for x in output])
                md = markdown.markdown(output)
                
                for k,v in remap.items():
                    md = md.replace(k, v.replace("<", "&lt;").replace(">", "&gt;"))
                output = md

                #output = re.sub('```[a-z]*', '```', output)

                output = output.split("```")

                
                final_output = [output[0]]
                for i,x in enumerate(output[1:]):
                    if i%2 == 1:
                        final_output.append(x)
                    else:
                        language = 'unkonwn'
                        if len(x) > 0 and x[0] != '\n':
                            language, _, x = x.partition("\n")

                        which_lexer = {'python': pygments.lexers.PythonLexer(),
                                       'c': pygments.lexers.CLexer(),
                                       'cpp': pygments.lexers.CppLexer(),
                                       'bash': pygments.lexers.BashLexer(),
                                       'html': pygments.lexers.HtmlLexer(),
                                       'javascript': pygments.lexers.JavascriptLexer(),
                                       'sql': pygments.lexers.SqlLexer()}.get(language)
                        x = x.replace("&lt;","<").replace("&gt;", ">")

                        if which_lexer is None:
                            # todo: do something not stupid for language detection
                            if x.count(";")*3 > x.count("\n"):
                                which_lexer = pygments.lexers.CLexer()
                            else:
                                which_lexer = pygments.lexers.PythonLexer()

                        code_block = "<style>" + HtmlFormatter().get_style_defs('.highlight') + "</style>" + highlight(x, which_lexer, HtmlFormatter(linenos=True, style='colorful'))
                            
                        final_output.append(code_block)

                output = "".join(final_output)


                final_output = output.split("sudo_make_me_an_image[")[0]
                for line in output.split("sudo_make_me_an_image[")[1:]:
                    url, _, rest = line.partition("]")
                    final_output += "<img style='max-width: 50%; max-height: 50%' src='{}'>".format(url)
                    final_output += rest

                
                example_html += one_tab.format((idx+1),final_output)
            
            open("evaluation_examples/"+column_key+"_"+row_key+".html", "w").write(css+example_html)

def convert_to_color_through_yellow(value):
    value *= 255

    # Determine the stage of interpolation
    if value <= 127.5:
        # Stage 1: Red to Yellow
        red = 255
        green = int(value) + 127.5  # Green increases from 0 to 255
        blue = 127.5
    else:
        # Stage 2: Yellow to Green
        red = int(255 - (value - 127.5))  # Red decreases from 255 to 0
        green = 255
        blue = 127.5

    return red, green, blue            

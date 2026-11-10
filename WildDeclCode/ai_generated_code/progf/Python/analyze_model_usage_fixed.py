# Assisted using common GitHub development utilities

import pandas as pd
from collections import defaultdict
import sys
from typing import Dict, List, Tuple
from datetime import datetime
import os

def analyze_model_usage_report(csv_file_path: str) -> None:
    """
    分析用户模型使用情况报告
    计算每个用户使用GPT-4.1模型和其他模型的请求数量，以及各模型占比
    按使用量从多到少排序
    """
    try:
        # 读取CSV文件
        print(f"正在读取文件: {csv_file_path}")
        df = pd.read_csv(csv_file_path)
        
        # 验证必要的列是否存在
        required_columns = ['User', 'Model', 'Requests Used']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"缺少必要的列: {missing_columns}")
        
        print(f"总记录数: {len(df)}")
        if 'Timestamp' in df.columns:
            print(f"时间范围: {df['Timestamp'].min()} 到 {df['Timestamp'].max()}")
        
        # 初始化用户统计字典
        user_model_stats = defaultdict(lambda: defaultdict(float))
        
        # 处理每一行数据
        for _, row in df.iterrows():
            user = row['User']
            model = row['Model']
            requests_used = float(row['Requests Used'])
            
            user_model_stats[user][model] += requests_used
        
        # 计算每个用户的统计数据
        user_analysis_data = []
        
        for user, model_stats in user_model_stats.items():
            # 分别统计GPT-4.1和其他模型的使用量
            gpt_4_1_requests = 0.0
            other_models_total = 0.0
            model_breakdown = {}
            
            for model, requests in model_stats.items():
                model_breakdown[model] = requests
                if 'gpt-4.1' in model.lower():
                    gpt_4_1_requests += requests
                else:
                    other_models_total += requests
            
            total_requests = gpt_4_1_requests + other_models_total
            
            # 计算占比
            gpt_4_1_percentage = (gpt_4_1_requests / total_requests * 100) if total_requests > 0 else 0
            other_models_percentage = (other_models_total / total_requests * 100) if total_requests > 0 else 0
            
            # 计算各个模型的占比
            model_percentages = {}
            for model, requests in model_breakdown.items():
                model_percentages[model] = (requests / total_requests * 100) if total_requests > 0 else 0
            
            user_analysis_data.append({
                'User': user,
                'GPT-4.1 Requests': gpt_4_1_requests,
                'GPT-4.1 Percentage': gpt_4_1_percentage,
                'Other Models Requests': other_models_total,
                'Other Models Percentage': other_models_percentage,
                'Total Requests': total_requests,
                'Model Breakdown': model_breakdown,
                'Model Percentages': model_percentages
            })
        
        # 按总请求数排序（从多到少）
        user_analysis_data.sort(key=lambda x: x['Total Requests'], reverse=True)
        
        # 输出用户分析结果
        print_user_analysis(user_analysis_data)
        
        # 输出整体模型使用分布
        print_overall_model_distribution(df)
        
        # 导出详细结果到Excel
        export_to_excel(user_analysis_data, csv_file_path)
        
        # 导出HTML报告
        export_to_html(user_analysis_data, df, csv_file_path)
        
        return user_analysis_data
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 {csv_file_path}")
    except pd.errors.EmptyDataError:
        print("错误: CSV文件为空")
    except Exception as e:
        print(f"分析过程中出现错误: {str(e)}")
        return None

def print_user_analysis(user_analysis_data: List[Dict]) -> None:
    """打印用户分析结果"""
    print("\n" + "="*100)
    print("用户模型使用情况分析报告")
    print("="*100)
    print(f"{'用户名':<20} {'GPT-4.1请求数':<15} {'GPT-4.1占比':<12} {'其他模型请求数':<18} {'其他模型占比':<15} {'总请求数':<12}")
    print("-"*100)
    
    for data in user_analysis_data:
        print(f"{data['User']:<20} {data['GPT-4.1 Requests']:<15.2f} {data['GPT-4.1 Percentage']:<12.2f}% {data['Other Models Requests']:<18.2f} {data['Other Models Percentage']:<15.2f}% {data['Total Requests']:<12.2f}")
    
    # 打印前10名用户的详细模型分布
    print("\n" + "="*100)
    print("TOP 10 用户详细模型使用分布")
    print("="*100)
    
    for i, data in enumerate(user_analysis_data[:10], 1):
        print(f"\n{i}. 用户: {data['User']} (总请求数: {data['Total Requests']:.2f})")
        print("-" * 60)
        
        # 按使用量排序模型
        sorted_models = sorted(data['Model Breakdown'].items(), key=lambda x: x[1], reverse=True)
        
        for model, requests in sorted_models:
            percentage = data['Model Percentages'][model]
            print(f"   {model:<35} {requests:<10.2f} ({percentage:.2f}%)")

def print_overall_model_distribution(df: pd.DataFrame) -> None:
    """打印整体模型使用分布"""
    print("\n" + "="*80)
    print("整体模型使用分布统计")
    print("="*80)
    
    # 按模型聚合统计
    model_stats = df.groupby('Model')['Requests Used'].agg(['count', 'sum']).reset_index()
    model_stats.columns = ['Model', 'Usage Count', 'Total Requests']
    model_stats = model_stats.sort_values('Total Requests', ascending=False)
    
    total_all_requests = model_stats['Total Requests'].sum()
    
    print(f"{'模型名称':<35} {'使用次数':<12} {'总请求数':<15} {'占比':<10}")
    print("-"*80)
    
    for _, row in model_stats.iterrows():
        percentage = (row['Total Requests'] / total_all_requests * 100) if total_all_requests > 0 else 0
        print(f"{row['Model']:<35} {row['Usage Count']:<12} {row['Total Requests']:<15.2f} {percentage:<10.2f}%")
    
    # 统计汇总
    print("\n" + "="*80)
    print("统计汇总")
    print("="*80)
    
    gpt_4_1_total = model_stats[model_stats['Model'].str.contains('gpt-4.1', case=False, na=False)]['Total Requests'].sum()
    other_models_total = total_all_requests - gpt_4_1_total
    
    print(f"总用户数: {len(df['User'].unique())}")
    print(f"总模型数: {len(model_stats)}")
    print(f"GPT-4.1 总请求数: {gpt_4_1_total:.2f}")
    print(f"其他模型总请求数: {other_models_total:.2f}")
    print(f"所有模型总请求数: {total_all_requests:.2f}")
    
    if total_all_requests > 0:
        print(f"GPT-4.1 整体占比: {(gpt_4_1_total/total_all_requests)*100:.2f}%")
        print(f"其他模型整体占比: {(other_models_total/total_all_requests)*100:.2f}%")

def export_to_excel(user_analysis_data: List[Dict], csv_file_path: str) -> None:
    """导出分析结果到Excel文件"""
    try:
        output_file = csv_file_path.replace('.csv', '_detailed_analysis.xlsx')
        
        # 创建用户汇总数据
        summary_data = []
        for data in user_analysis_data:
            summary_data.append({
                'User': data['User'],
                'GPT-4.1 Requests': data['GPT-4.1 Requests'],
                'GPT-4.1 Percentage': data['GPT-4.1 Percentage'],
                'Other Models Requests': data['Other Models Requests'],
                'Other Models Percentage': data['Other Models Percentage'],
                'Total Requests': data['Total Requests']
            })
        
        # 创建详细模型分布数据
        detailed_data = []
        for data in user_analysis_data:
            for model, requests in data['Model Breakdown'].items():
                detailed_data.append({
                    'User': data['User'],
                    'Model': model,
                    'Requests Used': requests,
                    'Percentage': data['Model Percentages'][model],
                    'Total User Requests': data['Total Requests']
                })
        
        # 写入Excel文件
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            # 用户汇总表
            summary_df = pd.DataFrame(summary_data)
            summary_df.to_excel(writer, sheet_name='用户汇总', index=False)
            
            # 详细分布表
            detailed_df = pd.DataFrame(detailed_data)
            detailed_df.to_excel(writer, sheet_name='详细分布', index=False)
        
        print(f"\n详细分析结果已导出到: {output_file}")
        
    except Exception as e:
        print(f"导出Excel文件时出现错误: {str(e)}")

def export_to_html(user_analysis_data: List[Dict], df: pd.DataFrame, csv_file_path: str) -> None:
    """导出分析结果到HTML文件"""
    try:
        output_file = csv_file_path.replace('.csv', '_analysis_report.html')
        
        # 计算整体统计
        total_users = len(user_analysis_data)
        total_all_requests = sum(data['Total Requests'] for data in user_analysis_data)
        total_gpt_4_1_requests = sum(data['GPT-4.1 Requests'] for data in user_analysis_data)
        total_other_requests = sum(data['Other Models Requests'] for data in user_analysis_data)
        
        # 计算模型分布统计
        model_stats = df.groupby('Model')['Requests Used'].agg(['count', 'sum']).reset_index()
        model_stats.columns = ['Model', 'Usage Count', 'Total Requests']
        model_stats = model_stats.sort_values('Total Requests', ascending=False)
        
        # 生成HTML内容
        html_content = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>模型使用情况分析报告</title>
    <style>
        body {{
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #2c3e50;
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }}
        h2 {{
            color: #34495e;
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin-top: 30px;
        }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }}
        .summary-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .summary-card h3 {{
            margin: 0 0 10px 0;
            font-size: 1.2em;
        }}
        .summary-card .number {{
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }}
        .summary-card .percentage {{
            font-size: 1.1em;
            opacity: 0.9;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background-color: #3498db;
            color: white;
            font-weight: bold;
            position: sticky;
            top: 0;
        }}
        tr:nth-child(even) {{
            background-color: #f8f9fa;
        }}
        tr:hover {{
            background-color: #e8f4f8;
        }}
        .progress-bar {{
            width: 100%;
            height: 20px;
            background-color: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
        }}
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, #3498db, #2ecc71);
            border-radius: 3px;
        }}
        .timestamp {{
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
        }}
        .top-users {{
            margin: 20px 0;
        }}
        .user-card {{
            background-color: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }}
        .user-name {{
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }}
        @media (max-width: 768px) {{
            .container {{
                padding: 15px;
            }}
            .summary-grid {{
                grid-template-columns: 1fr;
            }}
            table {{
                font-size: 14px;
            }}
            th, td {{
                padding: 8px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>模型使用情况分析报告</h1>
        
        <div class="summary-grid">
            <div class="summary-card">
                <h3>总用户数</h3>
                <div class="number">{total_users}</div>
            </div>
            <div class="summary-card">
                <h3>总请求数</h3>
                <div class="number">{total_all_requests:.2f}</div>
            </div>
            <div class="summary-card">
                <h3>GPT-4.1 请求数</h3>
                <div class="number">{total_gpt_4_1_requests:.2f}</div>
                <div class="percentage">({(total_gpt_4_1_requests/total_all_requests*100):.1f}%)</div>
            </div>
            <div class="summary-card">
                <h3>其他模型请求数</h3>
                <div class="number">{total_other_requests:.2f}</div>
                <div class="percentage">({(total_other_requests/total_all_requests*100):.1f}%)</div>
            </div>
        </div>
        
        <h2>用户使用情况排名</h2>
        <table>
            <thead>
                <tr>
                    <th>排名</th>
                    <th>用户名</th>
                    <th>GPT-4.1 请求数</th>
                    <th>其他模型请求数</th>
                    <th>模型详细分布</th>
                    <th>总请求数</th>
                </tr>
            </thead>
            <tbody>
"""
        
        # 添加用户数据行
        for i, data in enumerate(user_analysis_data, 1):
            # 判断其他模型请求数是否需要标记红色（大于300）
            other_models_style = 'style="color: red; font-weight: bold;"' if data['Other Models Requests'] > 300 else ''
            
            # 生成模型详细分布
            model_details = []
            sorted_models = sorted(data['Model Breakdown'].items(), key=lambda x: x[1], reverse=True)
            for model, requests in sorted_models:
                if 'gpt-4.1' not in model.lower():  # 只显示非GPT-4.1的模型
                    # 统一使用2位小数格式，确保小数点正确显示
                    model_details.append(f"{model}: {requests:.2f}")
            
            model_details_str = "<br>".join(model_details[:5])  # 最多显示前5个模型
            if len(model_details) > 5:
                model_details_str += "<br>..."
            
            html_content += f"""
                <tr>
                    <td>{i}</td>
                    <td><strong>{data['User']}</strong></td>
                    <td>{data['GPT-4.1 Requests']:.2f}</td>
                    <td {other_models_style}>{data['Other Models Requests']:.2f}</td>
                    <td style="font-size: 0.9em;">{model_details_str}</td>
                    <td>{data['Total Requests']:.2f}</td>
                </tr>
"""
        
        html_content += """
            </tbody>
        </table>
        
        <h2>TOP 10 用户详细模型分布</h2>
        <div class="top-users">
"""
        
        # 添加TOP 10用户的详细信息
        for i, data in enumerate(user_analysis_data[:10], 1):
            html_content += f"""
            <div class="user-card">
                <div class="user-name">{i}. {data['User']} (总请求数: {data['Total Requests']:.2f})</div>
                <div class="model-breakdown">
"""
            
            # 按使用量排序模型
            sorted_models = sorted(data['Model Breakdown'].items(), key=lambda x: x[1], reverse=True)
            
            for model, requests in sorted_models:
                percentage = data['Model Percentages'][model]
                html_content += f"""
                    <div class="model-item">
                        <span>{model}</span>
                        <span>{requests:.2f} ({percentage:.1f}%)</span>
                    </div>
"""
            
            html_content += """
                </div>
            </div>
"""
        
        html_content += """
        </div>
        
        <h2>整体模型使用分布</h2>
        <table>
            <thead>
                <tr>
                    <th>排名</th>
                    <th>模型名称</th>
                    <th>使用次数</th>
                    <th>总请求数</th>
                    <th>占比</th>
                    <th>使用分布</th>
                </tr>
            </thead>
            <tbody>
"""
        
        # 添加模型分布数据
        total_model_requests = model_stats['Total Requests'].sum()
        for i, (_, row) in enumerate(model_stats.iterrows(), 1):
            percentage = (row['Total Requests'] / total_model_requests * 100) if total_model_requests > 0 else 0
            
            html_content += f"""
                <tr>
                    <td>{i}</td>
                    <td>{row['Model']}</td>
                    <td>{row['Usage Count']:,}</td>
                    <td>{row['Total Requests']:.2f}</td>
                    <td>{percentage:.1f}%</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {min(percentage, 100)}%"></div>
                        </div>
                    </td>
                </tr>
"""
        
        # 添加时间戳和分析时间范围
        time_range = ""
        if 'Timestamp' in df.columns:
            time_range = f"<br>数据时间范围: {df['Timestamp'].min()} 到 {df['Timestamp'].max()}"
        
        html_content += f"""
            </tbody>
        </table>
        
        <div class="timestamp">
            <p>报告生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{time_range}</p>
            <p>数据来源: {os.path.basename(csv_file_path)}</p>
        </div>
    </div>
</body>
</html>
"""
        
        # 写入HTML文件
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"\nHTML分析报告已导出到: {output_file}")
        
    except Exception as e:
        print(f"导出HTML文件时出现错误: {str(e)}")

if __name__ == "__main__":
    # CSV文件路径
    csv_file = r"c:\github\githubcopilotdemo\模型分析\premium_usage_report_1_3393962b1602425fa286985f6f37b7c5.csv"
    
    # 执行分析
    print("开始分析用户模型使用情况...")
    result = analyze_model_usage_report(csv_file)
    
    if result:
        print("\n分析完成!")
        print("=" * 80)
        print("报告包含以下内容:")
        print("1. 用户模型使用情况分析（按总使用量排序）")
        print("2. TOP 10 用户详细模型使用分布")
        print("3. 整体模型使用分布统计")
        print("4. 统计汇总（包含占比信息）")
        print("5. 详细分析结果已导出到Excel文件")
        print("6. 可视化HTML报告已生成")
        print("6. 详细分析结果已导出到HTML文件")
    else:
        print("分析失败，请检查文件路径和格式。")

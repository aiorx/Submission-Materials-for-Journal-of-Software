"""
LangGraph Job Application Review Demo
A simple demonstration of using LangGraph to:
- Analyze job descriptions
- Generate personalized application letters
- Review and score applications

Aided with basic GitHub coding tools
"""

import os
from typing import TypedDict, Literal, Annotated, Optional
from operator import add
from langchain_core.runnables.config import RunnableConfig
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END


def set_environment():
    """Set up environment variables"""
    # Set your OpenAI API key here or in environment
    # os.environ["OPENAI_API_KEY"] = "your-openai-api-key"
    pass


# Job Application Review State
class JobApplicationState(TypedDict):
    job_description: str
    candidate_name: str
    candidate_experience: str
    is_suitable: bool
    application_letter: str
    review_score: int
    review_comments: str
    actions_taken: Annotated[list[str], add]


def analyze_job_requirements(state):
    """Analyze job description to determine suitability"""
    print("📋 Analyzing job requirements for {}...".format(state['candidate_name'])   
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
        
        messages = [
            SystemMessage(content="You are an HR expert analyzing job fit."),
            HumanMessage(content="
            Job Description: {}
            
            Candidate Experience: {}
            
            Based on the job requirements and candidate experience, 
            is this candidate suitable? Answer with 'YES' or 'NO' and briefly explain why.
            ".format(state['job_description'], state['candidate_experience']))
        ]
        
        response = llm.invoke(messages)
        is_suitable = "YES" in response.content.upper()
        
        print("✅ Analysis complete: {}".format('Suitable' if is_suitable else 'Not suitable')        
        return {
            "is_suitable": is_suitable,
            "actions_taken": ["Job requirements analyzed"]
        }
        
    except Exception as e:
        print("⚠️ Using fallback analysis: {}".format(e)      # Fallback: simple keyword matching
        job_lower = state['job_description'].lower()
        exp_lower = state['candidate_experience'].lower()
        
        # Simple matching logic
        common_words = set(job_lower.split()) & set(exp_lower.split())
        is_suitable = len(common_words) >= 3
        
        return {
            "is_suitable": is_suitable,
            "actions_taken": ["Job requirements analyzed (fallback)"]
        }


def generate_application_letter(state):
    """Generate personalized application letter"""
    print("✍️ Generating application letter for {}...".format(state['candidate_name'])  
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        
        messages = [
            SystemMessage(content="You are a professional career consultant writing application letters."),
            HumanMessage(content="
            Write a professional application letter for:
            
            Candidate: {}
            Experience: {}
            Job Description: {}
            
            Make it concise (2-3 paragraphs), professional, and highlight relevant experience.
            ".format(state['candidate_name'], state['candidate_experience'], state['job_description']))
        ]
        
        response = llm.invoke(messages)
        
        print("✅ Application letter generated successfully")
        
        return {
            "application_letter": response.content,
            "actions_taken": ["Application letter generated"]
        }
        
    except Exception as e:
        print("⚠️ Using template letter: {}".format(e)      # Fallback template
        template_letter = "
Dear Hiring Manager,

I am writing to express my interest in the position described in your job posting. 
As {}, I believe my background in {} 
makes me a strong candidate for this role.

My experience has prepared me well for the challenges of this position, and I am 
excited about the opportunity to contribute to your team.

Thank you for considering my application.

Sincerely,
{}
        ".format(state['candidate_name'], state['candidate_experience'], state['candidate_name']).strip()
        
        return {
            "application_letter": template_letter,
            "actions_taken": ["Template application letter generated"]
        }


def review_application(state):
    """Review and score the application"""
    print("🔍 Reviewing application for {}...".format(state['candidate_name'])   
    try:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
        
        messages = [
            SystemMessage(content="You are an HR manager reviewing job applications."),
            HumanMessage(content="
            Review this application and provide:
            1. A score from 1-10 (10 being excellent)
            2. Brief constructive feedback
            
            Job Description: {}
            Application Letter: {}
            
            Format your response as:
            SCORE: X
            COMMENTS: Your feedback here
            ".format(state['job_description'], state['application_letter']))
        ]
        
        response = llm.invoke(messages)
        
        # Parse response
        lines = response.content.split('\n')
        score = 7  # default
        comments = "Good application overall."
        
        for line in lines:
            if line.startswith('SCORE:'):
                try:
                    score = int(line.split(':')[1].strip())
                except:
                    pass
            elif line.startswith('COMMENTS:'):
                comments = line.split(':', 1)[1].strip()
        
        print("✅ Review complete - Score: {}/10".format(score)        
        return {
            "review_score": score,
            "review_comments": comments,
            "actions_taken": ["Application reviewed and scored"]
        }
        
    except Exception as e:
        print("⚠️ Using basic review: {}".format(e)      # Simple fallback scoring
        letter_length = len(state['application_letter'])
        score = min(10, max(1, letter_length // 50))  # Rough scoring based on length
        
        return {
            "review_score": score,
            "review_comments": "Application reviewed using basic criteria.",
            "actions_taken": ["Basic application review completed"]
        }


def should_generate_application(state: JobApplicationState) -> Literal["generate_application", "reject_application"]:
    """Route based on job suitability"""
    if state.get("is_suitable"):
        return "generate_application"
    return "reject_application"


def reject_application(state):
    """Handle rejection case"""
    print("❌ Application rejected for {}".format(state['candidate_name'])    return {
        "application_letter": "Thank you for your interest. Unfortunately, your background doesn't match our current requirements.",
        "review_score": 0,
        "review_comments": "Candidate experience doesn't align with job requirements.",
        "actions_taken": ["Application rejected due to poor fit"]
    }


def create_job_application_graph():
    """Create the job application review workflow"""
    # Aided with basic GitHub coding tools
    builder = StateGraph(JobApplicationState)
    
    # Add nodes
    builder.add_node("analyze_job", analyze_job_requirements)
    builder.add_node("generate_application", generate_application_letter)
    builder.add_node("review_application", review_application)
    builder.add_node("reject_application", reject_application)
    
    # Add edges
    builder.add_edge(START, "analyze_job")
    builder.add_conditional_edges("analyze_job", should_generate_application)
    builder.add_edge("generate_application", "review_application")
    builder.add_edge("review_application", END)
    builder.add_edge("reject_application", END)
    
    return builder.compile()


def demo_job_application_review():
    """Demonstrate the job application review process"""
    print("🚀 Job Application Review Demo")
    print("=" * 50)
    
    # Sample job and candidates
    job_description = """
    Software Engineer Position
    We're looking for a mid-level software engineer with experience in Python, 
    web development, and API design. The ideal candidate should have 3+ years 
    of experience with frameworks like FastAPI or Django, and familiarity with 
    cloud platforms like AWS or Google Cloud.
    """
    
    candidates = [
        {
            "candidate_name": "Alice Johnson",
            "candidate_experience": "5 years Python development, Django expert, AWS certified, built multiple REST APIs"
        },
        {
            "candidate_name": "Bob Smith", 
            "candidate_experience": "2 years Java development, Spring Boot, some Python scripting experience"
        },
        {
            "candidate_name": "Carol Chen",
            "candidate_experience": "4 years Python, FastAPI, Google Cloud, microservices architecture, API design"
        }
    ]
    
    graph = create_job_application_graph()
    
    for candidate in candidates:
        print("
📝 Processing application for {}".format(candidate['candidate_name'])       print("-" * 40)
        
        # Prepare state
        initial_state = {
            "job_description": job_description,
            "candidate_name": candidate["candidate_name"],
            "candidate_experience": candidate["candidate_experience"],
            "actions_taken": []
        }
        
        # Run the workflow
        result = graph.invoke(initial_state)
        
        # Display results
        print("
📊 Results for {}:".format(result['candidate_name'])       print("Suitable: {}".format('✅ Yes' if result['is_suitable'] else '❌ No')      print("Score: {}/10".format(result['review_score']))
        print("Comments: {}".format(result['review_comments']))
        print("Actions: {}".format(', '.join(result['actions_taken'])))
        
        if result['is_suitable']:
            print("
📄 Application Letter:"           print(result['application_letter'][:200] + "..." if len(result['application_letter']) > 200 else result['application_letter'])


def save_graph_visualization(graph, filename="job_review_workflow"):
    """Save graph visualization in multiple formats"""
    # Aided with basic GitHub coding tools
    try:
        # Try to save as PNG
        try:
            mermaid_png = graph.get_graph().draw_mermaid_png()
            with open("{}.png".format(filename), "wb") as f:
                f.write(mermaid_png)
            print("📊 Workflow diagram saved to {}.png".format(filename)       except Exception as png_error:
            print("⚠️ PNG generation failed: {}".format(png_error)          
            # Fallback: save as Mermaid text
            try:
                mermaid_code = graph.get_graph().draw_mermaid()
                with open("{}.mmd".format(filename), "w") as f:
                    f.write(mermaid_code)
                print("📊 Mermaid diagram code saved to {}.mmd".format(filename)               print("💡 You can visualize this at: https://mermaid.live/")
            except Exception as mmd_error:
                print("⚠️ Mermaid generation also failed: {}".format(mmd_error)              
                # Final fallback: save as ASCII representation
                try:
                    ascii_repr = graph.get_graph().print_ascii()
                    with open("{}.txt".format(filename), "w") as f:
                        f.write(ascii_repr)
                    print("📊 ASCII diagram saved to {}.txt".format(filename)               except Exception as ascii_error:
                    print("⚠️ ASCII generation failed: {}".format(ascii_error)                  
    except Exception as e:
        print("⚠️ Could not save any visualization: {}".format(e)      print("💡 To enable PNG visualization, install: pip install pygraphviz")


def main():
    """Main execution"""
    # Aided with basic GitHub coding tools
    set_environment()
    
    # Run the demo
    demo_job_application_review()
    
    # Save visualization
    print("
{}".format('='*50))
    graph = create_job_application_graph()
    save_graph_visualization(graph)
    
    print("
🎯 Demo Complete!"   print("This demo showed:")
    print("• Job requirement analysis")
    print("• Automated application letter generation") 
    print("• Application scoring and review")
    print("• Conditional workflow routing")
    print("• State management with action tracking")


if __name__ == "__main__":
    main()

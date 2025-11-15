from typing import Annotated, TypedDict

from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain_core.messages import BaseMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.types import interrupt
from pydantic import BaseModel

load_dotenv()


# Initialize the Chat Model
# model = init_chat_model("ollama:granite4:micro", temperature=0.25)
model = init_chat_model("google_genai:gemini-2.5-flash-lite")


# Define state schema
class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


class CheckInDetails(BaseModel):
    memberName: str
    className: str


@tool(description="Tool to check in a student to a class. Args: memberName, className")
def check_in_mat(checkInDetails: CheckInDetails) -> str:
    """"""
    res = interrupt({"check_in_details": checkInDetails})

    return f"Student check in : {res}"


system_prompt = """
Your objective is to call the check_in_mat tool with the correct parameters to check in a student to a class.

The tool requires:
- memberName: The name of the student to check in
- className: The name of the class they're checking in to

Details about all available classes and students will be provided in the last message of the conversation. Extract the appropriate member_name and class_name from that information and call the check_in_mat tool with those parameters.
"""


# Define the node function
def call_model(state: State):
    tools_model = model.bind_tools([check_in_mat])
    response = tools_model.invoke(state["messages"])

    response = tools_model.invoke(state["messages"])
    return {"messages": [response]}


checkpointer = InMemorySaver()

# Create and compile the graph
graph = (
    StateGraph(State)
    .add_node("agent", call_model)
    .add_edge(START, "agent")
    .add_edge("agent", END)
    .compile(checkpointer=checkpointer)
)

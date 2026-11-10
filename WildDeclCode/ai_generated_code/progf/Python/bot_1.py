# simple Discord built using discord.py raw code is manually written for learning comments is genratd using github copilot

# Import necessary Discord.py modules for bot functionality
import discord
from discord.ext import commands  # Extension for command handling
import logging  # For logging bot activities and errors
import discord.utils  # Utility functions for Discord operations
from dotenv import load_dotenv  # For loading environment variables from .env file
import os  # Operating system interface for environment variables

# Load environment variables from .env file into the program
load_dotenv()
# Retrieve the Discord bot token from environment variables for security
token = os.getenv("Discord_Token")            # loading the discord bot token from the .env

# Validate that the token was successfully loaded
if token == None:                             # checking if the token exisits or not 
    print("Token is invalid")
print("token is succefully loaded from .env")

# Configure logging to write bot activities to a file for debugging and monitoring
handler = logging.FileHandler(filename="discord.log", encoding="utf-8", mode="w")

# Set up bot permissions/intents - what the bot is allowed to access
intents = discord.Intents.default()                    # permission of the bot this is defaut
intents.message_content=True                           # and these are specified one
intents.members=True  # Allow bot to access member-related events and data

# Define the role name that will be used for role assignment commands
role = "PRO-BOT-USER"

# Create the bot instance with command prefix and intents configuration
bot = commands.Bot(command_prefix="/", intents=intents)        # adding prefix using discord.ext and config with intents

# Event handler that triggers when the bot successfully connects to Discord
@bot.event
async def on_ready():                                          # this function is going to be called when bot script is runned indicating the bot is working 
    print(f"the bot is online , configured bot name is {bot.user.name}")

# Event handler for when a new member joins the server - sends welcome DM
@bot.event
async def on_member_join(member):
    # Send a direct message to the new member welcoming them
    await member.send(f"WELCOME TO THE SERVER , {member.name}")

# Event handler for processing every message sent in the server
@bot.event
async def on_message(message):
    # Ignore messages sent by the bot itself to prevent infinite loops
    if message.author == bot.user:
        return
    # Content moderation: check for inappropriate language and take action
    if "shit" in message.content.lower():
        await message.delete()  # Remove the offensive message
        await message.channel.send(f"{message.author.mention} -  Dont use that word")  # Send warning
    # Process commands after message filtering (important for command functionality)
    await bot.process_commands(message)

# Command to assign the specified role to the user who invokes it
@bot.command()
async def assign(ctx):
    # Search for the role in the server's role list
    get_role = discord.utils.get(ctx.guild.roles, name=role)
    
    # Check if the role exists in the server
    if get_role:
        # Add the role to the command invoker
        await ctx.author.add_roles(get_role)
        await ctx.send(f"{ctx.author.mention} the {role} role is succesfully assigned")
    else:
        # Inform user if the role doesn't exist
        await ctx.send("Role doesn't exisits")

# Command to remove the specified role from the user who invokes it
@bot.command()
async def remove(ctx):
    # Search for the role in the server's role list
    get_role = discord.utils.get(ctx.guild.roles, name=role)
    
    # Check if the role exists in the server
    if get_role:
        # Remove the role from the command invoker
        await ctx.author.remove_roles(get_role)
        await ctx.send(f"{ctx.author.mention} the {role} role  is succesfully removed")
    else:
        # Inform user if the role doesn't exist
        await ctx.send("Role doesn't exisits")

# Command to send a direct message to the user with their provided message
@bot.command()
async def Dm(ctx,*,msg):  # *msg captures all remaining arguments as a single string
    # Send a DM to the command invoker with their message
    await ctx.author.send(f"you sent this message in {msg}")

# Command that demonstrates replying to a user's message
@bot.command()
async def reply(ctx):
    # Reply directly to the user's command message
    await ctx.reply("this is reply to your message")

# Simple test command to verify bot functionality
@bot.command()
async def test(ctx):
    # Send a confirmation message that the bot is operational
    await ctx.send("Bot is working!")

# Restricted command that only users with the specified role can use
@bot.command()
@commands.has_role(role)  # Decorator that checks if user has the required role
async def secret(ctx):
    # Send exclusive message to users with the special role
    await ctx.send(f"{ctx.author.mention} YOU are Member of the club")

# Command to create a poll with yes/no reactions
@bot.command()
async def poll(ctx,*,question):  # *question captures all remaining arguments as poll question
    # Create an embedded message for better visual presentation
    embed = discord.Embed(title="POLL", description=question)
    # Send the poll embed and store the message object
    poll_message = await ctx.send(embed=embed)
    # Add reaction options for voting
    await poll_message.add_reaction("✅")  # Yes option
    await poll_message.add_reaction("❎")  # No option

# Error handler for the secret command - handles missing role permissions
@secret.error
async def secret_error(ctx,error):
    # Check if the error is specifically due to missing required role
    if isinstance(error,commands.MissingRole):
        # Inform user they don't have the necessary permissions
        await ctx.send(f"You dont have a specific role for that")

# Start the bot with token, logging configuration, and debug level logging
bot.run(token,log_handler=handler,log_level=logging.DEBUG)
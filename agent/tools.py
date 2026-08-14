import psutil
import subprocess
from langchain_core.tools import tool

@tool
def get_system_diagnostics() -> str:
    """Returns CPU, RAM, and battery health report."""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory().percent
    battery = psutil.sensors_battery()
    bat_stat = f"{battery.percent}%" if battery else "AC Connected"
    return f"CPU Load: {cpu}%, Memory Usage: {ram}%, Power Status: {bat_stat}"

@tool
def launch_application(app_name: str) -> str:
    """Launches system applications."""
    try:
        if "chrome" in app_name.lower():
            subprocess.Popen(["start", "chrome"], shell=True)
        elif "terminal" in app_name.lower() or "cmd" in app_name.lower():
            subprocess.Popen(["start", "cmd"], shell=True)
        else:
            subprocess.Popen(["start", app_name], shell=True)
        return f"Application '{app_name}' launched successfully, sir."
    except Exception as e:
        return f"Failed to launch '{app_name}': {str(e)}"

available_tools = [get_system_diagnostics, launch_application]

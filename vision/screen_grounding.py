import pyautogui
from PIL import Image

class ScreenGroundingEngine:
    def capture_screen(self, output_path: str = "current_screen.png") -> Image.Image:
        screenshot = pyautogui.screenshot()
        screenshot.save(output_path)
        return screenshot

    def parse_interactive_elements(self) -> list:
        w, h = pyautogui.size()
        elements = [
            {"id": 1, "type": "taskbar", "label": "Start Menu", "coords": (int(w * 0.02), int(h * 0.98))},
            {"id": 2, "type": "browser", "label": "Active Tab", "coords": (int(w * 0.5), int(h * 0.05))},
            {"id": 3, "type": "workspace", "label": "Main Center Canvas", "coords": (int(w * 0.5), int(h * 0.5))}
        ]
        return elements

    def click_element(self, element_id: int):
        elements = self.parse_interactive_elements()
        target = next((item for item in elements if item["id"] == element_id), None)
        if target:
            x, y = target["coords"]
            pyautogui.click(x, y)
            return f"Clicked on {target['label']} at coordinates ({x}, {y})"
        return "Target element ID not found."

from pathlib import Path
import tempfile
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from server_character_renderer import CharacterSpec, render

with tempfile.TemporaryDirectory() as td:
    receipt = render(CharacterSpec(slug="agis-captain", name="AGIS", role="Captain", accessory="crown"), Path(td))
    assert receipt["status"] == "PASS"
    assert receipt["network_used"] is False
    assert receipt["subprocess_used"] is False
    assert receipt["dynamic_code_used"] is False
    assert len(receipt["palette"]) <= 16
    assert (Path(td) / "agis-captain" / "receipt.json").exists()

try:
    CharacterSpec(slug="../escape", name="x", role="x").validate()
except ValueError:
    pass
else:
    raise AssertionError("slug traversal guard failed")

print("TESTS_PASS")

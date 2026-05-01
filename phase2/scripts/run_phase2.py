from pathlib import Path
import sys

import uvicorn


PHASE2_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE2_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))


def main() -> None:
    uvicorn.run("phase2_input.app:app", host="127.0.0.1", port=8002, reload=False)


if __name__ == "__main__":
    main()

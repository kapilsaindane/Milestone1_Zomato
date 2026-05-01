from pathlib import Path
import sys


PHASE0_ROOT = Path(__file__).resolve().parents[1]
SRC_PATH = PHASE0_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from phase0_core.config import settings
from phase0_data.loader import download_dataset, save_raw_dataset
from phase0_data.preprocess import clean_dataset


def main() -> None:
    raw_path = settings.raw_data_dir / "zomato_raw.csv"
    processed_path = settings.processed_data_dir / "zomato_cleaned.csv"

    print(f"Downloading dataset: {settings.hf_dataset_id}")
    raw_df = download_dataset(settings.hf_dataset_id)
    save_raw_dataset(raw_df, raw_path)
    print(f"Saved raw dataset: {raw_path}")

    clean_df = clean_dataset(raw_df)
    processed_path.parent.mkdir(parents=True, exist_ok=True)
    clean_df.to_csv(processed_path, index=False)
    print(f"Saved cleaned dataset: {processed_path}")
    print(f"Rows: raw={len(raw_df)}, cleaned={len(clean_df)}")


if __name__ == "__main__":
    main()

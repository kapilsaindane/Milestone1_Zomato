from pathlib import Path

import pandas as pd
from datasets import load_dataset


def load_from_hf(dataset_id: str) -> pd.DataFrame:
    dataset = load_dataset(dataset_id)
    split_name = "train" if "train" in dataset else next(iter(dataset.keys()))
    return dataset[split_name].to_pandas()


def load_from_csv(csv_path: Path) -> pd.DataFrame:
    return pd.read_csv(csv_path)


def load_source_data(dataset_id: str, fallback_csv: Path | None = None) -> pd.DataFrame:
    try:
        return load_from_hf(dataset_id)
    except Exception:
        if fallback_csv and fallback_csv.exists():
            return load_from_csv(fallback_csv)
        raise

from pathlib import Path

import pandas as pd
from datasets import load_dataset


def download_dataset(dataset_id: str) -> pd.DataFrame:
    dataset = load_dataset(dataset_id)
    split_name = "train" if "train" in dataset else next(iter(dataset.keys()))
    return dataset[split_name].to_pandas()


def save_raw_dataset(df: pd.DataFrame, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)

#!/usr/bin/env python3
"""Offline research fixtures for #123; not an OSERA conformance gate.

Run with Python >=3.10 and pip installed. Add --uv to also exercise uv pip.
Creates synthetic wheels and isolated installation targets in a temporary directory.
No registry requests, project installation, or package publication is performed.
JSON on stdout records tool versions, commands, expectations and observations.
"""

import argparse
import base64
import csv
import hashlib
import importlib.metadata
import io
import json
import os
from pathlib import Path
import platform
import subprocess
import sys
import tempfile
import zipfile


def wheel(directory, version, name="osera_probe", requires=None):
    info = f"{name}-{version}.dist-info"
    metadata = f"Metadata-Version: 2.1\nName: {name}\nVersion: {version}\n"
    if requires:
        metadata += f"Requires-Dist: {requires}\n"
    files = {
        f"{name}/__init__.py": f"__version__ = {version!r}\n".encode(),
        f"{info}/METADATA": (metadata + "\n").encode(),
        f"{info}/WHEEL": b"Wheel-Version: 1.0\nGenerator: osera-research\nRoot-Is-Purelib: true\nTag: py3-none-any\n",
    }
    record = io.StringIO(newline="")
    writer = csv.writer(record)
    for path, data in files.items():
        digest = base64.urlsafe_b64encode(hashlib.sha256(data).digest()).rstrip(b"=").decode()
        writer.writerow([path, f"sha256={digest}", len(data)])
    writer.writerow([f"{info}/RECORD", "", ""])
    files[f"{info}/RECORD"] = record.getvalue().encode()
    with zipfile.ZipFile(directory / f"{name}-{version}-py3-none-any.whl", "w") as archive:
        for path, data in files.items():
            archive.writestr(path, data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--uv", action="store_true", help="Also run the uv pip interface")
    args = parser.parse_args()
    # Ignore ambient package-manager settings; keep normal system process settings.
    env = {k: v for k, v in os.environ.items() if not k.startswith(("PIP_", "UV_"))}
    env["PIP_CONFIG_FILE"] = os.devnull
    managers = {"pip": [sys.executable, "-m", "pip", "--isolated", "--disable-pip-version-check"]}
    if args.uv:
        managers["uv"] = ["uv", "--no-config", "--offline", "--no-cache", "pip"]
    versions = {"python": platform.python_version(), "platform": platform.platform()}
    versions["pip"] = subprocess.check_output([sys.executable, "-m", "pip", "--version"], env=env, text=True).strip()
    if args.uv:
        versions["uv"] = subprocess.check_output(["uv", "--version"], env=env, text=True).strip()
    base = ["1.4.1", "1.4.1+osera.1", "1.4.1+osera.2", "1.4.1+osera.10"]
    cases = [
        ("public equality", base, "osera-probe==1.4.1", "1.4.1+osera.10", None),
        ("arbitrary equality", base, "osera-probe===1.4.1", "1.4.1", None),
        ("explicit local pin", base, "osera-probe==1.4.1+osera.1", "1.4.1+osera.1", None),
        ("compatible range", base, "osera-probe~=1.4.1", "1.4.1+osera.10", None),
        ("next upstream", base + ["1.4.2"], "osera-probe~=1.4.1", "1.4.2", None),
        ("next upstream with public pin", base + ["1.4.2"], "osera-probe==1.4.1", "1.4.1+osera.10", None),
        ("exclusive lower bound", base, "osera-probe>1.4.1,<1.4.2", None, None),
        ("competing local label", base + ["1.4.1+vendor.1"], "osera-probe==1.4.1", "1.4.1+vendor.1", None),
        ("upstream postrelease", base + ["1.4.1.post1"], "osera-probe~=1.4.1", "1.4.1.post1", None),
        ("transitive public pin", base, "osera-consumer==1.0", "1.4.1+osera.10", "osera-probe==1.4.1"),
        ("transitive strict pin conflict", base, "osera-consumer==1.0", None, "osera-probe===1.4.1"),
    ]
    results = []
    with tempfile.TemporaryDirectory(prefix="osera-python-study-") as temporary:
        root = Path(temporary)
        for index, (label, candidates, requirement, expected, dependency) in enumerate(cases):
            directory = root / str(index)
            directory.mkdir()
            for version in candidates:
                wheel(directory, version)
            if dependency:
                wheel(directory, "1.0", "osera_consumer", dependency)
            constraint = directory / "constraints.txt"
            constraint.write_text("osera-probe==1.4.1+osera.10\n")
            for manager, prefix in managers.items():
                target = directory / manager
                command = prefix + ["install", "--no-index", "--find-links", str(directory), "--target", str(target)]
                if manager == "pip":
                    command += ["--ignore-installed", "--no-cache-dir"]
                else:
                    command += ["--python", sys.executable]
                if dependency:
                    command += ["--constraint", str(constraint)]
                command.append(requirement)
                run = subprocess.run(command, env=env, capture_output=True, text=True, timeout=60)
                distributions = {d.metadata["Name"].replace("_", "-"): d.version
                                 for d in importlib.metadata.distributions(path=[str(target)])}
                observed = distributions.get("osera-probe")
                # A failure is evidence only when it is a dependency-resolution failure.
                resolution_failure = any(token in run.stderr + run.stdout for token in
                                         ["ResolutionImpossible", "No matching distribution", "No solution found"])
                passed = ((run.returncode == 0 and observed == expected) if expected else
                          (run.returncode != 0 and resolution_failure and observed is None))
                results.append({"case": label, "manager": manager, "candidates": candidates,
                                "dependency": dependency, "command": [s.replace(str(root), "<TEMP>") for s in command],
                                "expected": expected, "observed": observed, "exit_code": run.returncode,
                                "passed": passed,
                                "diagnostic": (run.stdout + run.stderr).replace(str(root), "<TEMP>") if not passed or expected is None else None})
    print(json.dumps({"tools": versions, "scope": "synthetic offline wheel installs; no index, lockfile or native-wheel coverage", "results": results}, indent=2))
    return 0 if all(result["passed"] for result in results) else 1


if __name__ == "__main__":
    sys.exit(main())

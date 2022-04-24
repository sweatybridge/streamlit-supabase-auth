# streamlit-text-label

Custom streamlit component for JWT authentication with Supabase.
![Demo](https://user-images.githubusercontent.com/1639722/164980408-22bbd548-348d-449b-8865-b024f9fe7a68.png)

## Usage

Prerequisite:

- python >= 3.7

```python
import streamlit as st
from streamlit_supabase_auth import login, logout

session = login(
    url="https://xxxx.supabase.co",
    apiKey="<SUPABASE_KEY>",
    providers=["apple", "facebook", "github", "google"],
)
if not session:
    return
st.experimental_set_query_params(page=["success"])
with st.sidebar:
    logout()
```

More details in [example](example/app.py) directory.

## Develop

```bash
docker-compose up --build
```

Or manually, start the frontend

```bash
cd streamlit_supabase_auth/frontend
npm install
npm run start
```

Followed by the example app

```bash
RELEASE=DEV streamlit run example/app.py
```

## Publish

```bash
cd component/frontend
npm run build
cd ../..

pip install build
python -m build
```

## Known Issues

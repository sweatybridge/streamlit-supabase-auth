# streamlit-supabase-auth

![Demo](https://user-images.githubusercontent.com/1639722/164980408-22bbd548-348d-449b-8865-b024f9fe7a68.png)

## Usage

Prerequisite:

- python >= 3.7

```python
import streamlit as st
from streamlit_supabase_auth import login_form, logout_button

session = login_form(
    url="https://xxxx.supabase.co",
    apiKey="<SUPABASE_KEY>",
    providers=["apple", "facebook", "github", "google"],
)
if not session:
    return

# Update query param to reset url fragments
st.experimental_set_query_params(page=["success"])
with st.sidebar:
    st.write(f"Welcome {session['user']['email']}")
    logout_button()
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

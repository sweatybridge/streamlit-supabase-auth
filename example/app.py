import streamlit as st

from streamlit_supabase_auth import login, logout


def main():
    st.title("Component Gallery")
    st.header("Login with Supabase Auth")
    session = login(providers=["apple", "facebook", "github", "google"])
    st.write(session)
    if not session:
        return
    st.experimental_set_query_params(page=["success"])
    with st.sidebar:
        logout()


if __name__ == "__main__":
    main()

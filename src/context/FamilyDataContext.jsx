import React, { createContext, useContext, useReducer } from 'react';

const FamilyDataContext = createContext({});

export const useFamilyData = () => useContext(FamilyDataContext);

const initialState = {
  fdFilter: 'All', // 'All' or member name
  fdSortBy: 'Maturity Date', // 'Maturity Date', 'Amount', 'Member'
  passwordCategory: 'All',
  documentCategory: 'All',
  searchQuery: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FD_FILTER':
      return { ...state, fdFilter: action.payload };
    case 'SET_FD_SORT':
      return { ...state, fdSortBy: action.payload };
    case 'SET_PASSWORD_CATEGORY':
      return { ...state, passwordCategory: action.payload };
    case 'SET_DOCUMENT_CATEGORY':
      return { ...state, documentCategory: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export const FamilyDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FamilyDataContext.Provider value={{ state, dispatch }}>
      {children}
    </FamilyDataContext.Provider>
  );
};

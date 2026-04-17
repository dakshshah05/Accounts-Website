import React, { createContext, useContext, useReducer } from 'react';

const FamilyDataContext = createContext({});

export const useFamilyData = () => useContext(FamilyDataContext);

const initialState = {
  memberFilter: 'All', // 'All' or specific member name
  fdSortBy: 'Maturity Date',
  searchQuery: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MEMBER_FILTER':
      return { ...state, memberFilter: action.payload };
    case 'SET_FD_SORT':
      return { ...state, fdSortBy: action.payload };
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

import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
    },
    reducers:{
        // actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
        },
        addCompany:(state, action) => {
            const exists = state.companies.some((company) => company._id === action.payload?._id);
            if (!exists) {
                state.companies = [action.payload, ...state.companies];
            }
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});
export const {setSingleCompany, setCompanies, addCompany, setSearchCompanyByText} = companySlice.actions;
export default companySlice.reducer;
import { GET_PROFILE, PROFILE_ERROR , CLEAR_PROFILE,UPDATE_PROFILE,ACCOUNT_DELETED,GET_PROFILES,GET_REPOS,NO_REPOS} from "../actions/types";

const initialState={
    profile:null,
    profiles:[],
    loading:true,
    repos:[],
    error:{}
}

export default function(state=initialState,action){
    const {type,payload} = action;
    switch(type){
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false
            }
        case GET_REPOS:
            return {
                ...state,
                repos:payload,
                payload
            }
        case NO_REPOS:
            return {
                ...state,
                repos:[]
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error:payload
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            }
        default:
            return state;
    }
}
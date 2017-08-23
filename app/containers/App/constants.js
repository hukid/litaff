/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const DEFAULT_LOCALE = 'en';
export const LOAD_APP = 'app/LOAD_APP';
export const APP_LOADED = 'app/APP_LOADED';
export const SUBMIT_SIGNUP_USER = 'app/SUBMIT_SIGNUP_USER';
export const SIGNED_IN = 'app/SIGNED_IN';
export const SIGN_OUT = 'app/SIGN_OUT';
export const SIGNED_OUT = 'app/SIGNED_OUT';

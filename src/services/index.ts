import { CognitoIdentityServiceProvider } from 'aws-sdk'
import dynamoDBClient from '../model'
import AuthService from './authService'
import ToolsService from './toolService'

export const toolsService = new ToolsService(dynamoDBClient)
export const authService = new AuthService(new CognitoIdentityServiceProvider())

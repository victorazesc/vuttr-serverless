import { middyfy } from '@libs/lambda'
import IRequestProxyEvent from 'src/types/request'
import { ToolDTO } from 'src/types/tool.dto'
import { toolsService } from '../../services'

export const getAllTools = middyfy(async (event: IRequestProxyEvent) => {
  return await toolsService.getAllTools(event.queryStringParameters?.tag)
})

export const createTool = middyfy(async (event: IRequestProxyEvent) => {
  const { title, link, description, tags } = event.body
  return await toolsService.createTool({
    title,
    link,
    description,
    tags,
  })
})

export const getTool = middyfy(async (event: IRequestProxyEvent) => {
  const id = event.pathParameters.id
  return await toolsService.getTool(id)
})

export const updateTool = middyfy(async (event: IRequestProxyEvent) => {
  const id = event.pathParameters.id
  return await toolsService.updateTool(id, event.body as ToolDTO)
})

export const deleteTool = middyfy(async (event: IRequestProxyEvent) => {
  const id = event.pathParameters.id
  await toolsService.deleteTool(id)
})

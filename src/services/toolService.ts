import { handlerValidate } from '../libs/validateResolver'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 } from 'uuid'
import { CreateToolDTO, ToolDTO, UpdateToolDTO } from '../types/tool.dto'

export default class ToolsService {
  private readonly Tablename: string = 'toolsTable'

  constructor(private readonly docClient: DocumentClient) {}

  async getAllTools(tag?: string): Promise<ToolDTO[]> {
    const scanParams: DocumentClient.ScanInput = {
      TableName: this.Tablename,
      ...(tag && {
        FilterExpression: 'contains(#tags, :v)',
        ExpressionAttributeNames: { '#tags': 'tags' },
        ExpressionAttributeValues: { ':v': tag },
      }),
    }

    const tools = await this.docClient.scan(scanParams).promise()
    return tools.Items as ToolDTO[]
  }

  async createTool(tool: CreateToolDTO): Promise<ToolDTO> {
    const id = v4()
    const createToolDTO = new CreateToolDTO(tool)
    await handlerValidate(createToolDTO)
    await this.docClient
      .put({
        TableName: this.Tablename,
        Item: { ...createToolDTO, id, createdAt: new Date().toISOString() },
      })
      .promise()
    return { ...createToolDTO, id } as ToolDTO
  }

  async getToolById(id: string): Promise<ToolDTO> {
    const tool = await this.docClient
      .get({
        TableName: this.Tablename,
        Key: {
          id,
        },
      })
      .promise()
    return tool.Item as ToolDTO
  }

  async getTool(id: string) {
    const tool = await this.getToolById(id)
    if (!tool) {
      throw new Error('Tool does not exist')
    }
    return tool
  }

  async updateTool(id: string, tool: UpdateToolDTO): Promise<ToolDTO> {
    if (!tool) throw new Error('Empty Request')

    const toolExists = await this.getToolById(id)

    if (!toolExists) throw new Error('Tool does not exist')

    const updateToolDTO = new UpdateToolDTO(tool)

    await handlerValidate(updateToolDTO)

    const expressionAttributeNames = {}
    const expressionAttributeValues = {}
    let updateExpressions = ''

    Object.keys(updateToolDTO).forEach((key) => {
      expressionAttributeNames['#' + key] = key
      expressionAttributeValues[':' + key] = updateToolDTO[key]
      updateExpressions = `${
        updateExpressions ? updateExpressions + ',' : ''
      } #${key} = :${key}`
    })

    const updated = await this.docClient
      .update({
        TableName: this.Tablename,
        Key: { id },
        UpdateExpression: `set ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise()
    return updated.Attributes as ToolDTO
  }

  async deleteTool(id: string): Promise<any> {
    await this.docClient
      .delete({
        TableName: this.Tablename,
        Key: {
          id,
        },
      })
      .promise()

    return true
  }
}

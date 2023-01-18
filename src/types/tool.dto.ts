import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ToolDTO {
  id: string
  title: string
  link: string
  description: string
  tags: string[]
  createdAt: string
}

export class CreateToolDTO {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  link: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsArray()
  tags: string[]

  constructor(tool: CreateToolDTO) {
    this.title = tool.title
    this.link = tool.link
    this.description = tool.description
    this.tags = tool.tags ?? []
  }
}

export class UpdateToolDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  link?: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  tags?: string[]

  constructor(tool: UpdateToolDTO) {
    tool?.title ? (this.title = tool?.title) : null
    tool?.link ? (this.link = tool?.link) : null
    tool?.description ? (this.description = tool?.description) : null
    tool?.tags ? (this.tags = tool?.tags) : null
  }
}

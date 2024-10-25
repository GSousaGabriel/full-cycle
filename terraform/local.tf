variable "conteudo" {
    type = string
    default = "hello world"
}

resource "local_file" "exemplo" {
    filename = "exemplo.txt"
    content = var.conteudo
}

output "id_do_arquivo" {
  value = resource.local_file.exemplo.id
}

resource "local_file" "teste" {
    filename  ="teste.ts"
    content = "const a ={'id_exemplo':'${resource.local_file.exemplo.id}','name_exemplo':'${resource.local_file.exemplo.filename}'}"
}

output "chicken-egg" {
  value = sort(["chicken", "egg"])
}

data "local_file" "name_exemplo" {
    filename = "exemplo.txt"
}

output "data_source_result" {
  value = data.local_file.name_exemplo.content
}
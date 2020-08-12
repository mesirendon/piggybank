# PiggyBank
Repositorio de ejemplo de cómo crear un contrato inteligente para el caso de uso Alcancia

## Usar este repo
Clone el repositorio

```bash
$ git clone git@github.com:mesirendon/piggybank.git
```

### Dependencias
Para verificar los casos de pruebas garantice tener instalado globalmente estos paquetes: `ganache-cli` y `truffle`.

```bash
$ npm i -g ganache-cli truffle
```

### Probar
Es necesario tener una cadena de bloques virtual correndo, en una consola ejecute `ganache-cli`.

```bash
$ ganache-cli
```

Para correr las pruebas en otra consola ejecute:

```bash
$ truffle test
```

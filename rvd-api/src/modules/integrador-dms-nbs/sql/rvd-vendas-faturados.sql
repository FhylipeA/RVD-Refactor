SELECT
  emp.cod_empresa AS ID_EMPRESA,
  emp.nome AS EMPRESA,
  TO_CHAR(a.emissao, 'DD/MM/YYYY') AS DTA_ABERTURA_PROPOSTA,
  TO_CHAR(v.data_venda, 'DD/MM/YYYY') AS DATA_DA_NF,
  TO_CHAR(v.data_nota, 'DD/MM/YYYY') AS DATA_ENTRADA_ESTOQUE,
  TO_DATE(v.data_venda, 'DD/MM/YYYY') - TO_DATE(v.data_nota, 'DD/MM/YYYY') AS DIAS_ESTOQUE,
  UPPER(eu.nome_completo) AS NOME_VENDEDOR,
  eu.COD_EMPRESA_DEPARTAMENTO AS DEPARTAMENTO_VENDEDOR,
  ed.DESCRICAO AS DESCRICAO_DEPARTAMENTO_VENDEDOR,
  eu.COD_EMPRESA_DEPARTAMENTO AS TIME_VENDA,
  ed.DESCRICAO AS DES_TIME_VENDA,
  CASE WHEN EU.ID_FUNCIONARIO IS NULL THEN 0 ELSE EU.ID_FUNCIONARIO END ID_VENDEDOR,
  EU.CPF AS CPF_VENDEDOR,
  v.NOTA_FABRICA AS NF_NO,
  V.CHASSI_COMPLETO AS CHASSI,
  CASE WHEN v.data_venda IS NULL THEN NULL ELSE a.cod_proposta END PROPOSTA,
  CASE WHEN v.data_venda IS NULL THEN a.cod_proposta ELSE NULL END PROPOSTA_DEV,
  a.nome_cliente AS NOME_CLIENTE,
  b.descricao_modelo AS MODELO,
  p.descricao_produto AS TIPO_DE_MODELO,
  a.preco_basico AS PRECO_SUGERIDO,
  v.valor_vendido AS VALOR_NOTA_VENDA,
  v.total_nota_fabrica AS VALOR_NF_FABRICA,
  TO_DATE(v.data_venda, 'DD/MM/YYYY') - TO_DATE(a.emissao, 'DD/MM/YYYY') AS DIAS_ATE_FATURAR,
  'FATURADO' AS STATUS
FROM veiculos_propostas a
JOIN produtos_modelos b ON a.cod_produto = b.cod_produto AND a.cod_modelo = b.cod_modelo
JOIN produtos p ON b.cod_produto = p.cod_produto
JOIN empresas emp ON a.cod_empresa = emp.cod_empresa
LEFT JOIN clientes c ON a.cod_cliente = c.cod_cliente
JOIN empresas_usuarios eu ON a.vendedor = eu.nome
LEFT JOIN veiculos v ON a.cod_produto = v.cod_produto
  AND a.cod_modelo = v.cod_modelo
  AND a.chassi_resumido = v.chassi_resumido
  AND a.cod_empresa = v.cod_empresa
LEFT JOIN patio pt ON v.cod_patio = pt.cod_patio
LEFT JOIN EMPRESAS_DEPARTAMENTOS ed ON ed.COD_EMPRESA = eu.COD_EMPRESA
  AND ed.COD_EMPRESA_DEPARTAMENTO = eu.COD_EMPRESA_DEPARTAMENTO
WHERE a.status_proposta = 'V'
AND a.INTERNET = 'F'
AND V.CHASSI_COMPLETO IS NOT NULL
:filterString
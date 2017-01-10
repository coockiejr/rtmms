<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <body>
    <h2>Rosetta Terms</h2>
    <table border="1">
      <tr bgcolor="#9acd32">
        <th>Group</th>
        <th>REFID</th>
      </tr>
      <xsl:for-each select="catalog/cd">
        <tr>
          <td><xsl:value-of select="groups"/></td>
          <td><xsl:value-of select="Rosetta/term/refid"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
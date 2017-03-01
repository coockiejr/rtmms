<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <style>table {    border-collapse: collapse;}table, td, th {    border: 1px solid black;}</style>
      <body>
        <h2>Enum Terms</h2>
        <table>
          <tr bgcolor="#FFCC00">
            <th> Enum Groups</th>
            <th>Token</th>
            <th>REFID</th>
            <th>Enum Partition</th>
            <th>Enum CODE10</th>
            <th>Enum CF_CODE10</th>
            <th>Application Description</th>
            <th>Tags</th>
          </tr>
          <xsl:for-each select="enums/enum">
            <tr>
              <td>
                <xsl:for-each select="enumGroups">
                  <xsl:value-of select="."/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:value-of select="token"/>
              </td>
              <td>
                <xsl:value-of select="term/refid"/>
              </td>
              <td>
                <xsl:value-of select="term/partition"/>
              </td>
              <td>
                <xsl:value-of select="term/code10"/>
              </td>
              <td>
                <xsl:value-of select="term/cfCode10"/>
              </td>
              <td>
                <xsl:value-of select="description"/>
              </td>
              <td>
                <xsl:for-each select="tags">
                  <xsl:value-of select="."/>
                  <br/>
                </xsl:for-each>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
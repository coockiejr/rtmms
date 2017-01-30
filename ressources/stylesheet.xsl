<?xml version="1.0"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <style>table {    border-collapse: collapse;}table, td, th {    border: 1px solid black;}</style>
      <body>
        <h2>Rosetta Terms</h2>
        <table>
          <tr bgcolor="#FFCC00">
            <th>Group</th>
            <th>REFID</th>
            <th>Standard Table</th>
            <th>Systematic Name	</th>
            <th>Common Term	</th>
            <th>Acronym</th>
            <th>Term Description	</th>
            <th>Part</th>
            <th>CODE10</th>
            <th>CF_CODE10</th>
            <th>Description</th>
            <th>Display Name	</th>
            <th>UOM_MDC</th>
            <th>UCODE10</th>
            <th>CF_UCODE10</th>
            <th>UCUM</th>
            <th>Vendor UOM</th>
            <th>Enum_Values</th>
            <th>External_Sites</th>
            <th>Vendor ID</th>
            <th>Vendor Status</th>
            <th>Vendor Sort</th>
            <th>Vendor VMD</th>
            <th>Tags</th>
          </tr>
          <xsl:for-each select="Rosettas/rosetta">
            <tr>
              <td>
                <xsl:for-each select="groups">
                  <xsl:value-of select="."/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:value-of select="term/refid"/>
              </td>
              <td>
                <xsl:value-of select="term/standardTable"/>
              </td>
              <td>
                <xsl:value-of select="term/systematicName"/>
              </td>
              <td>
                <xsl:value-of select="term/commonTerm"/>
              </td>
              <td>
                <xsl:value-of select="term/acronym"/>
              </td>
              <td>
                <xsl:value-of select="term/termDescription"/>
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
                <xsl:value-of select="vendorDescription"/>
              </td>
              <td>
                <xsl:value-of select="displayName"/>
              </td>
              <td>
                <xsl:for-each select="units/unit">
                  <xsl:value-of select="term/refid"/>
                  <br/>
                </xsl:for-each>
                <xsl:for-each select="unitGroups/unitGroup">
                  <xsl:value-of select="groupName"/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:for-each select="units/unit">
                  <xsl:value-of select="term/code10"/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:for-each select="units/unit">
                  <xsl:value-of select="term/cfCode10"/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:for-each select="units/unit">
                  <xsl:for-each select="ucums/ucum">
                    <xsl:value-of select="value"/>
                  </xsl:for-each>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:value-of select="vendorUom"/>
              </td>
              <td>
                <xsl:for-each select="enums/enum">
                  <xsl:value-of select="term/refid"/>
                  <br/>
                </xsl:for-each>
                <xsl:for-each select="enumGroups/enumGroup">
                  <xsl:value-of select="groupName"/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:for-each select="externalSites/externalSite">
                  <xsl:value-of select="term/refid"/>
                  <br/>
                </xsl:for-each>
                <xsl:for-each select="externalSiteGroups/externalSiteGroup">
                  <xsl:value-of select="groupName"/>
                  <br/>
                </xsl:for-each>
              </td>
              <td>
                <xsl:value-of select="contributingOrganization"/>
              </td>
              <td>
                <xsl:value-of select="vendorStatus"/>
              </td>
              <td>
                <xsl:value-of select="vendorSort"/>
              </td>
              <td>
                <xsl:value-of select="vendorVmd"/>
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
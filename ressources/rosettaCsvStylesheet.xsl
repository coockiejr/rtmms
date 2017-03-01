<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text" encoding="utf-8"/>
    <xsl:variable name="newLine">
        <xsl:text>&#10;</xsl:text>
    </xsl:variable>
    <xsl:template match="/">
        <xsl:text>"Group";"REFID";"Standard Table";"Systematic Name";"Common Term";"Acronym";"Term Description";"Part";"CODE10";"CF_CODE10";"Description";"Display Name";"UOM_MDC";"UCODE10";"CF_UCODE10";"UCUM";"Vendor UOM";"Enum_Values";"External_Sites";"Vendor ID";"Vendor Status";"Vendor Sort";"Vendor VMD";"Tags"</xsl:text>
        <xsl:text>&#10;</xsl:text>
        <xsl:for-each select="Rosettas/rosetta">
            <xsl:text>"</xsl:text>
            <xsl:for-each select="groups">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="."/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                        
            </xsl:for-each>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/refid"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/standardTable"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/systematicName"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/commonTerm"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/acronym"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/termDescription"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/partition"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/code10"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="term/cfCode10"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="vendorDescription"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="displayName"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:for-each select="units/unit">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/refid"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                            
            </xsl:for-each>
            <xsl:text>";</xsl:text>
            <xsl:for-each select="unitGroups/unitGroup">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="groupName"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                            
            </xsl:for-each>
            <xsl:for-each select="units/unit">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/code10"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                    
            </xsl:for-each>
            <xsl:for-each select="units/unit">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/cfCode10"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                    
            </xsl:for-each>
            <xsl:for-each select="units/unit">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/cfCode10"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                    
            </xsl:for-each>
            <xsl:for-each select="units/unit">
                <xsl:for-each select="ucums/ucum">
                    <xsl:text>"</xsl:text>
                    <xsl:value-of select="value"/>
                    <xsl:text>"</xsl:text>
                    <br/>&#10;                                                                                                                                                                                            
                </xsl:for-each>
            </xsl:for-each>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="vendorUom"/>
            <xsl:text>";</xsl:text>
            <xsl:for-each select="enums/enum">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/refid"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                                        
            </xsl:for-each>
            <xsl:for-each select="enumGroups/enumGroup">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="groupName"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                                        
            </xsl:for-each>
            <xsl:for-each select="externalSites/externalSite">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="term/refid"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                                        
            </xsl:for-each>
            <xsl:for-each select="externalSiteGroups/externalSiteGroup">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="groupName"/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                                        
            </xsl:for-each>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="contributingOrganization"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="vendorStatus"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="vendorSort"/>
            <xsl:text>";</xsl:text>
            <xsl:text>"</xsl:text>
            <xsl:value-of select="vendorVmd"/>
            <xsl:text>";</xsl:text>
            <xsl:for-each select="tags">
                <xsl:text>"</xsl:text>
                <xsl:value-of select="."/>
                <xsl:text>"</xsl:text>
                <br/>&#10;                                                                                                                                                                                        
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:srw_dc="info:srw/schema/1/dc-schema"
	xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:eac-cpf="urn:isbn:1-931666-33-4"
	xmlns:eac="urn:isbn:1-931666-33-4">

	<xsl:output method="xml" indent="yes"/>
	<xsl:strip-space elements="*"/>
    <xsl:template match="/">
        <oai_dc:dc xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
            <xsl:apply-templates/>
        </oai_dc:dc>
    </xsl:template>
    
    <xsl:template match="eac:eac-cpf">
        <dc:identifier>
            <xsl:value-of select="/eac:eac-cpf/eac:control/eac:recordId"/>
        </dc:identifier>
        
		<dc:title>
			<xsl:value-of select="eac:cpfDescription/eac:identity/eac:nameEntry[@localType='primary']/eac:part"/>
		</dc:title>
        
        <dc:title>
            <xsl:value-of select="eac:cpfDescription/eac:identity/eac:nameEntry[@localType='abbreviation']/eac:part"/>
        </dc:title>
        
        <dc:description>
            <xsl:value-of select="eac:cpfDescription/eac:description/eac:biogHist/eac:p"/>
        </dc:description>
        
        <xsl:for-each
            select="eac:cpfDescription/eac:relations/eac:cpfRelation/eac:relationEntry">
        <dc:relation>
            <xsl:if test="normalize-space(.)!= ''">
                <xsl:value-of select="."/>
            </xsl:if>
        </dc:relation>
        </xsl:for-each>
	</xsl:template>

	<!-- suppress all else:-->
	<xsl:template match="*"/>
</xsl:stylesheet>
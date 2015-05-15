<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    >

    <xsl:template match="/">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="SIdoraConcept">
        <xsl:for-each select="measurements">
            <xsl:if test="current()!='' or (*/@*!='')">
                <dt>
                    <xsl:text>Measurements: </xsl:text>
                </dt>
                <xsl:for-each select="measurementText">
                    <xsl:if test="current()!=''">
                        <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>            
                <xsl:for-each select="measurement">
                    <dd>
                        <xsl:if test="@type != ''">
                            <xsl:text>Type:</xsl:text><xsl:value-of select="@type"/>:
                        </xsl:if>
                        <xsl:text>  Value:</xsl:text><xsl:value-of select="@value"/>
                        <xsl:text> </xsl:text>
                        <xsl:text>  Units:</xsl:text><xsl:value-of select="@units"/>
                    </dd>
                </xsl:for-each>
                
                <xsl:for-each select="accuracy/note">
                    <xsl:if test="current() != ''">
                        <dd><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each>  
                <xsl:for-each select="note">
                    <xsl:if test="current() != ''">
                        <dd><xsl:text>Note: </xsl:text><xsl:value-of select="."/></dd>
                    </xsl:if>
                </xsl:for-each> 
                <br></br>
            </xsl:if>        
        </xsl:for-each>
    </xsl:template>          
</xsl:stylesheet>